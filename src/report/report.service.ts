/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/entities/transaction.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as puppeteer from 'puppeteer';
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {
    handlebars.registerHelper(
      'isGreaterThanOne',
      function (value: string | any[]) {
        console.log(value);
        if (value.length > 1) {
          return true;
        }
        return false;
      },
    );
  }
  async generatePdfFromHtml(id: number): Promise<Buffer> {
    // console.log(id);
    try {
      // console.log();]
      const totalTransactions = await this.transactionRepository
        .createQueryBuilder('transaction')
        .select([
          'SUM(CASE WHEN transaction.type = :receita THEN transaction.value ELSE 0 END) AS totalReceita',
          'SUM(CASE WHEN transaction.type = :despesa THEN transaction.value ELSE 0 END) AS totalDespesa',
          'category.name AS categoryName',
          'SUM(transaction.value) AS valorDespesa',
        ])
        .leftJoin('transaction.category', 'category')
        .where('transaction.type IN (:receita, :despesa)', {
          receita: 'receita',
          despesa: 'despesa',
        })
        .andWhere('transaction.companyId = :companyId', { companyId: id })
        .andWhere('transaction.date >= :startDate', {
          startDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 1,
            1,
          ),
        })
        .andWhere('transaction.date <= :endDate', { endDate: new Date() })
        .getRawOne();

      const despesas = await this.transactionRepository
        .createQueryBuilder('transaction')
        .select([
          'category.name AS categoryName',
          'GROUP_CONCAT(JSON_OBJECT("transaction_value", transaction.value, "transaction_description", transaction.description)) AS transactionCategory',
          'SUM(transaction.value) AS total',
        ])
        .addSelect('SUM(transaction.value)', 'total')
        .leftJoin('transaction.category', 'category')
        .where('transaction.type = :type', { type: 'despesa' })
        .andWhere('transaction.companyId = :companyId', { companyId: id })
        .andWhere('transaction.date >= :startDate', {
          startDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 1,
            1,
          ),
        })
        .andWhere('transaction.date <= :endDate', { endDate: new Date() })
        .groupBy('categoryName')
        .orderBy('total', 'DESC')
        .getRawMany();

      const resultWeek = await this.transactionRepository
        .createQueryBuilder('transaction')
        .select([
          'DATE(transaction.date) AS transactionDate',
          'SUM(transaction.value) AS totalProfit',
        ])
        .where('transaction.type = :type', { type: 'receita' })
        .andWhere('transaction.companyId = :companyId', { companyId: id })
        .andWhere('transaction.date >= :startDate', {
          startDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 1,
            1,
          ),
        })
        .andWhere('transaction.date <= :endDate', { endDate: new Date() })
        .groupBy('transactionDate')
        .orderBy('totalProfit', 'DESC')
        .limit(1)
        .getRawMany();
      console.log(resultWeek);

      const weeklyCalendar = new Array(7)
        .fill(null)
        .map(() => ({ date: '', totalProfit: 0 }));
      resultWeek.forEach((item) => {
        const date = new Date(item.transactionDate);
        const dayOfWeek = date.getDay(); // 0 para domingo, 1 para segunda, ..., 6 para sábado

        weeklyCalendar[dayOfWeek] = {
          date: item.transactionDate,
          totalProfit: parseFloat(item.totalProfit),
        };
      });

      // const dayWithMaxProfit = weeklyCalendar.reduce((maxDay, currentDay) =>
      //   currentDay.totalProfit > maxDay.totalProfit ? currentDay : maxDay,
      // );

      // // Destacar o dia com o maior lucro
      // weeklyCalendar.forEach((day: any) => {
      //   day.highlighted = day.day === dayWithMaxProfit.day;
      // });

      // console.log(weeklyCalendar);

      // .createQueryBuilder('transaction')
      // .select([
      //   'category.name AS categoryName',
      //   'transaction.description',
      //   'transaction.value',
      // ])
      // .addSelect('SUM(transaction.value)', 'total')
      // .leftJoin('transaction.category', 'category')
      // .where('transaction.type = :type', { type: 'despesa' })
      // .andWhere('transaction.date >= :startDate', {
      //   startDate: new Date(
      //     new Date().getFullYear(),
      //     new Date().getMonth() - 1,
      //     1,
      //   ),
      // })
      // .andWhere('transaction.date <= :endDate', { endDate: new Date() })
      // .groupBy('categoryName')
      // .orderBy('total', 'DESC')
      // .getRawMany();
      // .createQueryBuilder('transaction')
      // .select('category.name', 'categoryName')
      // .addSelect('')
      // .addSelect('SUM(transaction.value)', 'total')
      // .leftJoin('transaction.category', 'category')
      // .where('transaction.type = :type', { type: 'despesa' })
      // .andWhere('transaction.date >= :startDate', {
      //   startDate: new Date(
      //     new Date().getFullYear(),
      //     new Date().getMonth() - 1,
      //     1,
      //   ),
      // })
      // .andWhere('transaction.date <= :endDate', { endDate: new Date() })
      // .groupBy('categoryName')
      // .orderBy('total', 'DESC')
      // .getRawMany();

      // errado
      // .createQueryBuilder('transaction')
      // .select('category.name', 'categoryName')
      // .addSelect('SUM(transaction.value)', 'total')
      // .leftJoin('transaction.category', 'category')
      // .where('transaction.type = :type', { type: 'despesa' })
      // .andWhere('transaction.date >= :startDate', {
      //   startDate: new Date(
      //     new Date().getFullYear(),
      //     new Date().getMonth() - 1,
      //     1,
      //   ),
      // })
      // .andWhere('transaction.date <= :endDate', { endDate: new Date() })
      // .groupBy('categoryName')
      // .orderBy('total', 'DESC')
      // .getRawMany();

      function parseTransactionCategory(categoryString: string): any {
        try {
          return JSON.parse(categoryString);
        } catch (error) {
          console.error('Erro ao analisar a string JSON:', error);
          return null; // Ou algum valor padrão, dependendo do seu caso
        }
      }

      const result = despesas.map((item) => ({
        categoryName: item.categoryName,
        total: item.total,
        transactionCategory: parseTransactionCategory(
          `[${item.transactionCategory}]`,
        ),
      }));

      // console.log(result);
      const templateData = {
        title: 'Relatório Dinâmico',
        date: {
          initial: new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 1,
            1,
          ).toLocaleDateString(),
          end: new Date().toLocaleDateString(),
        },
        content: result,
        totalTransactions: totalTransactions,
        isProfit:
          totalTransactions.totalReceita - totalTransactions.totalDespesa >= 0
            ? true
            : false,
        profit: totalTransactions.totalReceita - totalTransactions.totalDespesa,
      };

      const templateFilePath = path.join(
        __dirname,
        '../../views/report-template.hbs',
      );
      // console.log(despesas);
      const templateContent = fs.readFileSync(templateFilePath, 'utf-8');
      const compiledTemplate = handlebars.compile(templateContent);
      const htmlContent = compiledTemplate(templateData);
      const browser = await puppeteer.launch({
        headless: 'new',
      });
      const page = await browser.newPage();
      await page.setContent(htmlContent);
      const pdfBuffer = await page.pdf({ format: 'A4' });

      await browser.close();
      return pdfBuffer;
    } catch (error) {
      console.error('Erro ao gerar PDF a partir do banco de dados:', error);
      throw error;
    }
  }

  async findAll() {
    // const planningCategories = await this.planningCategoryRepository.find({
    //   // Adapte conforme necessário, assumindo que 'created_at' é a data do planejamento
    //   where: {
    //     created_at: new Date(`2023-11-01`),
    //   },
    // });
    // const result = [];
    // for (const planningCategory of planningCategories) {
    //   const totalTransactions = await this.transactionRepository
    //     .createQueryBuilder('transaction')
    //     .select('SUM(transaction.value)', 'totalSpent')
    //     .where('transaction.categoryId = :categoryId', {
    //       categoryId: planningCategory.categoryId,
    //     })
    //     .andWhere('transaction.date >= :startDate', {
    //       startDate: new Date(`2023-${month}-01`),
    //     })
    //     .andWhere('transaction.date < :endDate', {
    //       endDate: new Date(`2023-${month + 1}-01`),
    //     })
    //     .getRawOne();
    //   result.push({
    //     categoryName: planningCategory.category.name,
    //     plannedValue: planningCategory.plannedValue,
    //     totalSpent: totalTransactions.totalSpent || 0, // Pode ser nulo se não houver transações
    //   });
    // }
  }
}
