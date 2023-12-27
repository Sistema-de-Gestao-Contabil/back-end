/* eslint-disable @typescript-eslint/no-var-requires */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { UpdatePlanningDto } from './dto/update-planning.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Planning } from 'src/entities/planning.entity';
import { Repository } from 'typeorm';
import { PlanningCategory } from 'src/entities/planning_category.entity';
import { Transaction } from 'src/entities/transaction.entity';
import * as puppeteer from 'puppeteer';
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');
import { CompanyService } from 'src/company/company.service';
import { formatDate } from 'utils/formatDate';

@Injectable()
export class PlanningService {
  constructor(
    @InjectRepository(Planning)
    private planningRepository: Repository<Planning>,
    private readonly companyService: CompanyService,
    @InjectRepository(PlanningCategory)
    private hasCategoriesRepository: Repository<PlanningCategory>,
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  /*------Exemplo de utilização queryBuilder
  await this.planningRepository
      .createQueryBuilder('planning')
      .delete()
      .from(Planning)
      .where("id = :id", { id: id })
      .execute() */

  async create(companyId: number, createPlanningDto: CreatePlanningDto) {
    const company = await this.companyService.findOne(companyId);

    if (!company) {
      throw new Error('Empresa não encontrada');
    }

    const planningData = this.planningRepository.create({
      month: createPlanningDto.month,
      value: createPlanningDto.value,
      company: company,
      hasCategory: createPlanningDto.hasCategory,
    });
    await this.planningRepository.save(planningData);

    if (!planningData) {
      throw new Error('Não foi possível criar o planejamento');
    }

    planningData.hasCategory.map(async (item) => {
      const data = this.hasCategoriesRepository.create({
        planning: planningData,
        category: item.category,
        valuePerCategory: item.valuePerCategory,
      });
      return await this.hasCategoriesRepository.save(data);
    });
    return planningData;
  }

  async remove(id: number) {
    const removePlanning = await this.planningRepository.findOne({
      relations: {
        hasCategory: true,
      },
      where: { id: id },
    });
    if (removePlanning) {
      //Apagando relacionamento
      removePlanning.hasCategory.forEach(
        async (item) => await this.hasCategoriesRepository.delete(item.id),
      );
      //Apagando item de planejamento
      return await this.planningRepository.delete(removePlanning.id);
      // return await this.findAll();
    } else {
      throw new Error(`Não foi possível apagar o item de id ${{ id }}`);
    }
  }

  async findAll(companyId: number) {
    const data = await this.planningRepository
      .createQueryBuilder('planning')
      .innerJoinAndSelect('planning.hasCategory', 'hasCategory')
      .innerJoinAndSelect('hasCategory.category', 'category')
      .where('planning.companyId = :company', { company: companyId })
      .getMany();

    const a = Promise.all(
      data.map(async (planejamento) => {
        const date = planejamento.month;
        const ano = date.split('-');
        const transaction = await Promise.all(
          planejamento.hasCategory.map(async (item2) => {
            return await this.transactionsRepository
              .createQueryBuilder('transactions')
              .innerJoinAndSelect('transactions.category', 'category')
              .select('SUM(transactions.value)', 'categoriaSoma')
              .where('transactions.category = :category', {
                category: item2.category.id,
              })
              .andWhere('date >= :date', {
                date: new Date(parseInt(ano[0]), parseInt(ano[1]) - 1, 1),
              })
              .andWhere('transactions.date <= :endDate', {
                endDate: new Date(parseInt(ano[0]), parseInt(ano[1]) + 1, 0),
              })
              .getRawOne();
          }),
        );
        return { planejamento, transaction };
      }),
    );
    return a;
  }

  async findOne(id: number) {
    const data = await this.planningRepository
      .createQueryBuilder('planning')
      .innerJoinAndSelect('planning.hasCategory', 'hasCategory')
      .innerJoinAndSelect('hasCategory.category', 'category')
      .where('planning.id = :id', { id })
      .getMany();

    const a = Promise.all(
      data.map(async (planejamento) => {
        const date = planejamento.month;
        const ano = date.split('-');
        const transaction = await Promise.all(
          planejamento.hasCategory.map(async (item2) => {
            return await this.transactionsRepository
              .createQueryBuilder('transactions')
              .innerJoinAndSelect('transactions.category', 'category')
              .select('SUM(transactions.value)', 'categoriaSoma')
              .where('transactions.category = :category', {
                category: item2.category.id,
              })
              .andWhere('date >= :date', {
                date: new Date(parseInt(ano[0]), parseInt(ano[1]) - 1, 1),
              })
              .andWhere('transactions.date <= :endDate', {
                endDate: new Date(parseInt(ano[0]), parseInt(ano[1]) + 0, 0),
              })
              .getRawOne();
          }),
        );
        return { planejamento, transaction };
      }),
    );
    return a;
  }

  async update(id: number, updatePlanningDto: UpdatePlanningDto) {
    await this.hasCategoriesRepository
      .createQueryBuilder('hasCategories')
      .delete()
      .where('planningId = :id', { id })
      .execute();

    const planningData = this.planningRepository.create({
      id: id,
      month: updatePlanningDto.month,
      value: updatePlanningDto.value,
      hasCategory: updatePlanningDto.hasCategory,
    });
    await this.planningRepository.save(planningData);

    if (!planningData) {
      throw new Error('Não foi possível alterar o planejamento');
    }

    planningData.hasCategory.map(async (item) => {
      const data = this.hasCategoriesRepository.create({
        planning: planningData,
        category: item.category,
        valuePerCategory: item.valuePerCategory,
      });
      return await this.hasCategoriesRepository.save(data);
    });
    return planningData;
  }

  async generatePDF(id: number) {
    const planning = await this.findOne(id);

    if (planning.length <= 0) {
      throw new BadRequestException(`Não há nenhum planejamento`);
    }

    const totalTransactions = planning[0].transaction
      .filter((item) => item.categoriaSoma !== null)
      .map((item) => parseFloat(item.categoriaSoma))
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    const transactions = planning[0].transaction.map((item) =>
      item.categoriaSoma != null ? item.categoriaSoma : 0.0,
    );

    function compareCategories(data: any) {
      const result = data.planejamento.hasCategory.map(
        (category: any, index: any) => {
          const categoriaSoma = parseFloat(
            data.transaction[index].categoriaSoma,
          );
          const valuePerCategory = parseFloat(category.valuePerCategory);

          console.log({ categoriaSoma: categoriaSoma });

          if (isNaN(categoriaSoma)) {
            return 'Nenhuma despesa';
          }
          if (categoriaSoma <= valuePerCategory) {
            return 'Dentro da meta';
          } else {
            return 'Fora da meta';
          }
        },
      );

      return result;
    }
    const transactionsCategoryStatus = compareCategories(planning[0]);

    console.log(
      formatDate(
        new Date(
          Number(planning[0].planejamento.month.split('-')[0]),
          Number(planning[0].planejamento.month.split('-')[1]) - 1,
          1,
        ),
      ),
    );
    // planning[0].planejamento.month.split('-')[0],
    // formatDate(
    //   new Date(
    //     Number(planning[0].planejamento.month.split('-')[0]),
    //     Number(planning[0].planejamento.month.split('-')[1]) - 1,
    //     1,
    //   ),
    // ),
    // `${formatDate(
    //   new Date(
    //     Number(planning[0].planejamento.month.split('-')[0]),
    //     Number(planning[0].planejamento.month.split('-')[1]) + 0,
    //     0,
    //   ),
    // )} de ${new Date().getFullYear()}`,

    const templateData = {
      title: 'Relatório',
      total: totalTransactions,
      date: {
        initial: formatDate(
          new Date(
            Number(planning[0].planejamento.month.split('-')[0]),
            Number(planning[0].planejamento.month.split('-')[1]) - 1,
            1,
          ),
        ),
        end: `${formatDate(
          new Date(
            Number(planning[0].planejamento.month.split('-')[0]),
            Number(planning[0].planejamento.month.split('-')[1]) + 0,
            0,
          ),
        )} de ${new Date().getFullYear()}`,
      },
      planning: planning[0].planejamento,
      transaction: transactions,
      transactionsCategoryStatus: transactionsCategoryStatus,
      status:
        planning[0].planejamento.value >= totalTransactions
          ? 'Dentro do orçamnto'
          : 'meta nao atinjida',
    };

    const templateFilePath = path.resolve('views', 'report-template.hbs');

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

    // return result[0];
  }
}
