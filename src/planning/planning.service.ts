import { Injectable } from '@nestjs/common';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { UpdatePlanningDto } from './dto/update-planning.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Planning } from 'src/entities/planning.entity';
import { Repository } from 'typeorm';
import { PlanningCategory } from 'src/entities/planning_category.entity';

@Injectable()
export class PlanningService {
  constructor(
    @InjectRepository(Planning)
    private planningRepository: Repository<Planning>,
    @InjectRepository(PlanningCategory)
    private hasCategoriesRepository: Repository<PlanningCategory>,
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
    } else {
      throw new Error(`Não foi possível apagar o item de id ${{ id }}`);
    }
  }

  async findAll() {
    return this.planningRepository
      .createQueryBuilder('planning')
      .innerJoinAndSelect('planning.hasCategory', 'hasCategory')
      .innerJoinAndSelect('hasCategory.category', 'category')
      .getMany();
  }

  findOne(id: number) {
    return this.planningRepository
      .createQueryBuilder('planning')
      .innerJoinAndSelect('planning.hasCategory', 'hasCategory')
      .innerJoinAndSelect('hasCategory.category', 'category')
      .where('planning.id = :id', {id})
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
