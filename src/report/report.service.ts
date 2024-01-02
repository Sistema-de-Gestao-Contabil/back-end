/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, BadRequestException } from '@nestjs/common';
import { Transaction } from 'src/entities/transaction.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as puppeteer from 'puppeteer';
import { calendarDay, formatDate } from 'utils/formatDate';
import { Request } from 'express';
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
        // console.log(value);
        if (value.length > 1) {
          return true;
        }
        return false;
      },
    );
    handlebars.registerHelper(
      'getStatusColor',
      function (value: any, day: any, itsShow: any) {
        if (itsShow === true && value === day) {
          // console.log('entrou', value);
          return true;
        }
        if (itsShow === true && value != day) {
          return false;
        }
        // console.log(typeof value, typeof day);
        if (value === day) {
          return '#fff';
        } else {
          return '#82838B';
        }
      },
    );
    handlebars.registerHelper(
      'isProfit',
      function (expense: any, revenue: any) {
        if (expense > revenue) {
          return false;
        } else {
          return true;
        }
      },
    );
  }
  async generatePdfFromHtml(id: number, req: Request): Promise<Buffer> {
    const type = req.query.type;

    try {
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
          startDate:
            type === 'monthly'
              ? new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
              : new Date(new Date().setHours(0, 0, 0, 0)),
        })
        .andWhere('transaction.date <= :endDate', {
          endDate:
            type === 'monthly'
              ? new Date()
              : new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  new Date().getDate() + 1,
                ),
        })
        .groupBy('categoryName')
        .orderBy('total', 'DESC')
        .getRawMany();

      const receita = await this.transactionRepository
        .createQueryBuilder('transaction')
        .select([
          'category.name AS categoryName',
          'GROUP_CONCAT(JSON_OBJECT("transaction_value", transaction.value, "transaction_description", transaction.description)) AS transactionCategory',
          'SUM(transaction.value) AS total',
        ])
        .addSelect('SUM(transaction.value)', 'total')
        .leftJoin('transaction.category', 'category')
        .where('transaction.type = :type', { type: 'receita' })
        .andWhere('transaction.companyId = :companyId', { companyId: id })
        .andWhere('transaction.date >= :startDate', {
          startDate:
            type === 'monthly'
              ? new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
              : new Date(new Date().setHours(0, 0, 0, 0)),
        })
        .andWhere('transaction.date <= :endDate', {
          endDate:
            type === 'monthly'
              ? new Date()
              : new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  new Date().getDate() + 1,
                ),
        })
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
          startDate:
            type === 'monthly'
              ? new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
              : new Date(),
        })
        .andWhere('transaction.date <= :endDate', {
          endDate:
            type === 'monthly'
              ? new Date()
              : new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  new Date().getDate() + 1,
                ),
        })
        .groupBy('transactionDate')
        .orderBy('totalProfit', 'DESC')
        .limit(1)
        .getRawMany();

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

      const revenue = receita.map((item) => ({
        categoryName: item.categoryName,
        total: item.total,
        transactionCategory: parseTransactionCategory(
          `[${item.transactionCategory}]`,
        ),
      }));
      console.log(receita.length, despesas.length);
      if (receita.length <= 0 && despesas.length <= 0) {
        throw new BadRequestException(
          `Não há nenhuma transação ${
            type === 'monthly' ? 'mensal' : 'diária'
          }`,
        );
      }
      const totalTransactions = await this.transactionRepository
        .createQueryBuilder('transaction')
        .select([
          'COALESCE(SUM(CASE WHEN transaction.type = :receita THEN transaction.value ELSE 0 END), 0) AS totalReceita',
          'COALESCE(SUM(CASE WHEN transaction.type = :despesa THEN transaction.value ELSE 0 END), 0) AS totalDespesa',
          'COALESCE(SUM(transaction.value), 0) AS valorDespesa',
        ])
        .leftJoin('transaction.category', 'category')
        .where('transaction.type IN (:receita, :despesa)', {
          receita: 'receita',
          despesa: 'despesa',
        })
        .andWhere('transaction.companyId = :companyId', { companyId: id })
        .andWhere('transaction.date >= :startDate', {
          startDate:
            type === 'monthly'
              ? new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
              : new Date(new Date().setHours(0, 0, 0, 0)),
        })
        .andWhere('transaction.date <= :endDate', {
          endDate:
            type === 'monthly'
              ? new Date()
              : new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  new Date().getDate() + 1,
                ),
        })
        .getRawOne();

      console.log('000', receita, revenue, resultWeek);

      const templateData = {
        title: 'Relatório Dinâmico',
        date: {
          initial: formatDate(
            new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          ),
          end: `${formatDate(new Date())} de ${new Date().getFullYear()}`,
        },
        content: result,
        revenue: revenue,
        totalTransactions: totalTransactions,
        calendar: calendarDay(resultWeek[0].transactionDate),
        biggestProfitDay:
          resultWeek.length > 0
            ? {
                day: resultWeek[0].transactionDate.getDate(),
                velue: resultWeek[0].totalProfit,
              }
            : null,
        isProfit:
          totalTransactions.totalReceita - totalTransactions.totalDespesa >= 0
            ? true
            : false,
        profit: totalTransactions.totalReceita - totalTransactions.totalDespesa,
      };

      const templateFilePath = path.resolve('views', 'report-transaction.hbs');

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
