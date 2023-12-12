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
    // private readonly sectorService: SectorService,
  ) {}
  async generatePdfFromHtml(): Promise<Buffer> {
    console.log(
      new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    );
    try {
      const somas = await this.transactionRepository
        .createQueryBuilder('transaction')
        .select([
          'SUM(CASE WHEN transaction.type = :receita THEN transaction.value ELSE 0 END) AS totalReceita',
          'SUM(CASE WHEN transaction.type = :despesa THEN transaction.value ELSE 0 END) AS totalDespesa',
        ])
        .where('transaction.type IN (:receita, :despesa)', {
          receita: 'receita',
          despesa: 'despesa',
        })
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
        .select('category.name', 'categoryName')
        .addSelect('')
        .addSelect('SUM(transaction.value)', 'total')
        .leftJoin('transaction.category', 'category')
        .where('transaction.type = :type', { type: 'despesa' })
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

      console.log(despesas);
      const templateData = {
        title: 'Relatório Dinâmico',
        content: despesas,
      };

      const templateFilePath = path.join(
        __dirname,
        '../../views/report-template.hbs',
      );

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
}
