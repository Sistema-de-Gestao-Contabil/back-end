/* eslint-disable @typescript-eslint/no-var-requires */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactioDto } from './dto/create-transactio.dto';
import { UpdateTransactioDto } from './dto/update-transactio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity'
import { Repository } from 'typeorm';
import { Category } from 'src/entities/category.entity';
import { Company } from 'src/entities/company.entity';
import { Request } from 'express';
import { Employee } from 'src/entities/employee.entity';
import { calendarDay, formatDate } from 'utils/formatDate';
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');
import * as puppeteer from 'puppeteer';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(Category)
    private categorysRepository: Repository<Category>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
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
        if (expense - revenue > 0) {
          return false;
        } else {
          return true;
        }
      },
    );
  }

  async create(createTransactioDto: CreateTransactioDto) {
    try {
      //Buscando a categoria pelo id indicado pela requisição
      const findCategory = await this.categorysRepository.findOne({
        where: {
          id: createTransactioDto.categoryId,
        },
      });

      //Buscando a empresa pelo id indicado pela requisição
      const findCompany = await this.companyRepository.findOne({
        where: {
          id: createTransactioDto.companyId,
        },
      });

      if (!findCategory) {
        return {
          status: 400,
          message: 'Categoria não encontrada',
        };
      }

      if (!findCompany) {
        return {
          status: 400,
          message: 'Empresa não encontrada',
        };
      }

      if (findCategory!.name === 'Salário') {
        //Pegando os funcionários da empresa informada pelo companyId na requisição
        const findAllEmployees = await this.employeeRepository.findBy({
          company: findCompany,
        });

        findAllEmployees?.map(async (employeeId) => {
          //buscando funcionário pelo id
          const findEmployee = await this.employeeRepository.findOne({
            where: {
              id: employeeId.id,
            },
          });

          if (!findEmployee) {
            return {
              status: 400,
              message: 'Funcionário não encontrado',
            };
          }

          const addTransactionWage = this.transactionsRepository.create({
            value: findEmployee?.wage,
            description: `Pagamento de salário para o funcionário ${findEmployee?.name}`,
            date: createTransactioDto.date,
            type: createTransactioDto.type,
            status: createTransactioDto.status,
          });

          //Associando a categoria a transação
          addTransactionWage.category = findCategory;

          //Associando a empresa a transação
          addTransactionWage.company = findCompany;

          //Associando o employee a transação
          addTransactionWage.employee = findEmployee!;

          //subtraindo o valor cashBalance de tabela de company com o valor do salário do funcionário da tabela de employee
          await this.companyRepository.update(createTransactioDto.companyId, {
            cashBalance: findCompany.cashBalance - findEmployee!.wage,
          });

          await this.transactionsRepository.save(addTransactionWage);
        });

        return {
          status: 201,
          message: 'Transações realizadas com sucesso',
        };
      } else {
        const addTransaction = this.transactionsRepository.create({
          value: createTransactioDto.value,
          description: createTransactioDto.description,
          date: createTransactioDto.date,
          type: createTransactioDto.type,
          status: createTransactioDto.status,
        });

        //Associando a categoria a transação
        addTransaction.category = findCategory;

        //Associando a empresa a transação
        addTransaction.company = findCompany;

        //subtraindo o valor cashBalance de tabela de company com o valor da despesa enviado pela requisição
        if (createTransactioDto.type === 'despesa') {
          await this.companyRepository.update(createTransactioDto.companyId, {
            cashBalance:
              findCompany.cashBalance - Number(createTransactioDto.value),
          });
        }

        //somando o valor cashBalance de tabela de company com o valor da despesa enviado pela requisição
        if (createTransactioDto.type === 'receita') {
          await this.companyRepository.update(createTransactioDto.companyId, {
            cashBalance:
              findCompany.cashBalance + Number(createTransactioDto.value),
          });
        }

        const result = await this.transactionsRepository.save(addTransaction);
        return {
          status: 201,
          result,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        message:
          'Devido a um erro interno não possível realizar o cadastro da transação',
      };
    }
  }

  //Buscando todas as transações
  async findAll(resquest: Request) {
    try {
      const { valueFilter, statusFilter, dateFilter, typeFilter, companyId } =
        resquest.query;
      const query = this.transactionsRepository
        .createQueryBuilder('transaction')
        .select('transaction')
        .leftJoinAndSelect('transaction.category', 'category')
        .leftJoinAndSelect('transaction.company', 'company')
        .where('transaction.companyId = :companyId', { companyId });

      if (typeFilter) {
        query.where('transaction.type = :typeFilter', { typeFilter });
      }

      if (valueFilter) {
        //filtrando pelos valores mais altos
        if (valueFilter === 'alto') {
          query.orderBy('value', 'DESC');
        }

        //filtrando pelos valores mais baixos
        else {
          query.orderBy('value', 'ASC');
        }
      }

      //filtrando por pago e não pago
      if (statusFilter) {
        query.where('transaction.status = :statusFilter', { statusFilter });
      }

      if (dateFilter) {
        //filtrando pelas datas mais recente
        if (dateFilter == 'recente') {
          query.orderBy('date', 'DESC');
        }

        //filtrando pelas datas mais antiga
        else {
          query.orderBy('date', 'ASC');
        }
      }

      const result = await query.getMany(); // Executa a consulta e obtém os resultados
      return {
        result,
        status: 200,
      }; // Retorna os resultados como resposta JSON
    } catch (error) {
      console.error('Erro na execução da consulta:', error.message);

      return {
        status: 500,
        massage: 'Devido a um erro interno não foi possível realizar as buscas',
      };
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.transactionsRepository
        .createQueryBuilder('transaction')
        .select('transaction')
        .leftJoinAndSelect('transaction.category', 'category')
        .leftJoinAndSelect('transaction.company', 'company')
        .where('transaction.id = :id', { id })
        .getOne();

      if (!result?.id) {
        return {
          status: 404,
          massage: 'Transação não encontrada',
        };
      }

      return {
        status: 200,
        result,
      };
    } catch (error) {
      return {
        status: 500,
        massage: 'Devido a um erro interno não foi possível realizar a busca',
      };
    }
  }

  async update(updateTransactioDto: UpdateTransactioDto, request: Request) {
    try {
      const id = Number(request.query.id);
      const companyId = Number(request.query.companyId);
      const findTransaction = await this.transactionsRepository.find({
        where: {
          id: id,
        },
        relations: { company: true },
      });

      if (findTransaction.length > 0) {
        if (companyId === findTransaction[0].company.id) {
          await this.transactionsRepository.update(id, updateTransactioDto);
          return {
            status: 200,
            message: 'Transação atualizada com sucesso.',
          };
        } else {
          return {
            status: 400,
            message:
              'Esta empresa não tem permissão para alterar essa transação.',
          };
        }
      } else {
        return {
          status: 400,
          message: 'Transação não encontrada.',
        };
      }
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        message:
          'Devido a um erro interno não foi possível alterar a transação.',
      };
    }
  }

  async remove(request: Request) {
    try {
      const id = Number(request.query.id);
      const companyId = Number(request.query.companyId);

      const findTransaction = await this.transactionsRepository.find({
        where: {
          id: id,
        },
        relations: { company: true },
      });

      if (findTransaction.length > 0) {
        if (companyId == findTransaction[0].company.id) {
          await this.transactionsRepository.delete(id);
          return {
            status: 200,
            message: 'A transação foi removida com sucesso.',
          };
        } else {
          return {
            status: 400,
            message:
              'Esta empresa não tem permissão para remover essa transação.',
          };
        }
      } else {
        return {
          status: 400,
          message: 'Transação não encontrada.',
        };
      }
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        message:
          'Devido a um erro interno não foi possível remover a transação.',
      };
    }
  }

  async trasactionsInfo(id: number) {
    console.log(id);
  }

  async graphicData(id: number) {
    console.log(
      new Date(new Date().getFullYear(), new Date().getMonth() + 0, 0),
    );
    const totalSpentResult = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.value)', 'totalSpent')
      .where('transaction.type = :type', { type: 'despesa' })
      .andWhere('transaction.companyId = :companyId', { companyId: id })
      .getRawOne();

    const totalSpent = parseFloat(totalSpentResult.totalSpent) || 1;
    const topSpentCategories = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .select([
        'category.name AS categoryName',
        'SUM(transaction.value) AS totalSpent',
        `((SUM(transaction.value) / :totalSpent) * 100) AS percentage`,
      ])
      .leftJoin('transaction.category', 'category')
      .where('transaction.companyId = :companyId', { companyId: id })
      .andWhere('transaction.type = :type', { type: 'despesa' })
      .groupBy('categoryName')
      .orderBy('totalSpent', 'DESC')
      .setParameter('totalSpent', totalSpent)
      .getRawMany();

    const incomeResult = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .select([
        'category.name AS categoryName',
        'SUM(transaction.value) AS totalSpent',
        `((SUM(transaction.value) / :totalSpent) * 100) AS percentage`,
      ])
      .leftJoin('transaction.category', 'category')
      .where('transaction.companyId = :companyId', { companyId: id })
      .andWhere('transaction.type = :type', { type: 'receita' })
      .groupBy('categoryName')
      .orderBy('totalSpent', 'DESC')
      .setParameter('totalSpent', totalSpent)
      .getRawMany();

    const resultData = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .select([
        'company.id AS companyId',
        'company.cash_balance AS cashBalance',
        'SUM(CASE WHEN transaction.type = "receita" THEN transaction.value ELSE 0 END) AS totalRevenue',
        'COUNT(DISTINCT CASE WHEN transaction.type = "receita" THEN transaction.id END) AS countRevenue',
        'COUNT(DISTINCT CASE WHEN transaction.type = "despesa" THEN transaction.id END) AS countExpense',
      ])
      .leftJoin('transaction.company', 'company')
      .where('company.id = :companyId', { companyId: id })
      .getRawOne();
    const result = {
      expense: topSpentCategories,
      revenue: incomeResult,
      info: resultData,
    };

    console.log({ resultData: resultData });
    return result;
  }

  async generatePdfFromHtml(id: number, req: Request): Promise<Buffer> {
    const type = req.query.type;
    try {
      const despesas = await this.transactionsRepository
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

      const receita = await this.transactionsRepository
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

      const resultWeek = await this.transactionsRepository
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

      const totalTransactions = await this.transactionsRepository
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
      console.log(
        totalTransactions.totalReceita - totalTransactions.totalDespesa >= 0
          ? true
          : false,
      );

      const templateData = {
        title: 'Relatório Dinâmico',
        date: {
          initial:
            type === 'monthly'
              ? formatDate(
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() - 1,
                    1,
                  ),
                )
              : formatDate(new Date()),
          end:
            type === 'monthly'
              ? `${formatDate(new Date())} de ${new Date().getFullYear()}`
              : `diário`,
        },
        content: result,
        revenue: revenue,
        totalTransactions: totalTransactions,
        calendar:
          resultWeek.length > 0
            ? calendarDay(new Date(resultWeek[0].transactionDate))
            : null,
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
}
