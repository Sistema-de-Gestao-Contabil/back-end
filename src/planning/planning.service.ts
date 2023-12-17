import { Injectable } from '@nestjs/common';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { UpdatePlanningDto } from './dto/update-planning.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Planning } from 'src/entities/planning.entity';
import { Repository } from 'typeorm';
import { PlanningCategory } from 'src/entities/planning_category.entity';
import { Transaction } from 'src/entities/transaction.entity';

@Injectable()
export class PlanningService {
  constructor(
    @InjectRepository(Planning)
    private planningRepository: Repository<Planning>,
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

  async create(createPlanningDto: CreatePlanningDto) {
    const planningData = this.planningRepository.create({
      month: createPlanningDto.month,
      value: createPlanningDto.value,
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

  async findAll() {
    const data = await this.planningRepository
      .createQueryBuilder('planning')
      .innerJoinAndSelect('planning.hasCategory', 'hasCategory')
      .innerJoinAndSelect('hasCategory.category', 'category')
      .getMany();

    const a = Promise.all(
      data.map(async (planejamento) => {
        console.log(data);
        const date = planejamento.month;
        const ano = date.split('-');
        let transaction = await Promise.all(
          planejamento.hasCategory.map(async (item2) => {
            return await this.transactionsRepository
              .createQueryBuilder('transactions')
              .innerJoinAndSelect('transactions.category', 'category')
              .select('SUM(transactions.value)', 'categoriaSoma')
              .where('transactions.category = :category', {
                category: item2.category.id,
              })
              .andWhere('date >= :date', {
                date: new Date(parseInt(ano[0]), parseInt(ano[1]) - 1, 1)
              })
              .andWhere('transactions.date <= :endDate', {
                endDate: new Date(parseInt(ano[0]), parseInt(ano[1]) - 1, 31)
                
              })
              .getRawOne();
          }),
        );
        return { planejamento, transaction };
      }),
    );
    return a;
  }

  async findDespesas() {
    // const data = "2023-05"
    // const ano = data.split('-')
    // console.log(parseInt(ano[0]), parseInt(ano[1]))

    const data = await this.planningRepository
      .createQueryBuilder('planning')
      .innerJoinAndSelect('planning.hasCategory', 'hasCategory')
      .innerJoinAndSelect('hasCategory.category', 'category')
      .getRawMany();

    const a = Promise.all(
      data.map(async (item) => {
        console.log(data);
        const date = item.planning_month;
        const ano = date.split('-');
        let categoryId = item.category_id;
        const transaction = await this.transactionsRepository
          .createQueryBuilder('transactions')
          .innerJoinAndSelect('transactions.category', 'category')
          .select('transactions.value')
          .where('categoryId = :categoryId', { categoryId: categoryId })
          .andWhere('date = :date', {
            date: new Date(parseInt(ano[0]), parseInt(ano[1]) - 1, 1),
          })
          .getMany();
        return { planning: { data, transaction } };

        // return dado
      }),
    );
    return a;
  }

  findOne(id: number) {
    return this.planningRepository
      .createQueryBuilder('planning')
      .innerJoinAndSelect('planning.hasCategory', 'hasCategory')
      .innerJoinAndSelect('hasCategory.category', 'category')
      .where('planning.id = :id', { id })
      .getMany();
  }

  async update(
    id: number,
    updatePlanningDto: UpdatePlanningDto,
    planningCategoryId: number,
  ) {
    await this.planningRepository.save({
      id: id,
      month: updatePlanningDto.month,
      value: updatePlanningDto.value,
    });

    return await this.hasCategoriesRepository.save({
      id: planningCategoryId,
      valuePerCategory: updatePlanningDto.valuePerCategory,
    });
  }
}
