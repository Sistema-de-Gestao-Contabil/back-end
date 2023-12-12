/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { UpdateReportDto } from './dto/update-report.dto';
import { Transaction } from 'src/entities/transaction.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as puppeteer from 'puppeteer';
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');
// const fs = require('fs-extra');
// import { Response } from 'express';

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
      const despesas = await this.transactionRepository
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
        // .andWhere('transaction.date >= :startDate', { startDate: startDate }) // Adicionando :startDate
        .andWhere('transaction.date >= :startDate', {
          startDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 1,
            1,
          ),
        })
        .andWhere('transaction.date <= :endDate', { endDate: new Date() })
        .groupBy('categoryName')
        .orderBy('valorDespesa', 'DESC')
        .getRawOne();
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

  async create() {
    // pdf
    //   .create('<h1>Hello, PDF!</h1>', options)
    //   .toFile('<h1>Hello, PDF!</h1>', function (error, response) {
    //     if (error) {
    //       reject(error);
    //     } else {
    //       resolve(response);
    //     }
    //   });
    // Gere o PDF
    // return pdfStream;
    // const despesas = await this.transactionRepository
    //   .createQueryBuilder('transaction')
    //   .select('category.name', 'categoryName')
    //   .addSelect('SUM(transaction.value)', 'total')
    //   .leftJoin('transaction.category', 'category')
    //   .where('transaction.type = :type', { type: 'despesa' })
    //   .groupBy('categoryName')
    //   .orderBy('total', 'DESC')
    //   .getRawMany();
    // const receitas = await this.transactionRepository
    //   .createQueryBuilder('transaction')
    //   .select('category.name', 'categoryName')
    //   .addSelect('SUM(transaction.value)', 'total')
    //   .leftJoin('transaction.category', 'category')
    //   .where('transaction.type = :type', { type: 'receita' })
    //   .groupBy('categoryName')
    //   .orderBy('total', 'DESC')
    //   .getRawMany();
    // console.log({ receitas: receitas }, { despesas: despesas });
    // return despesas;
  }

  findAll() {
    return `This action returns all report`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    console.log(updateReportDto);
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
