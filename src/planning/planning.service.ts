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

 async create(createPlanningDto: CreatePlanningDto) {
      const planningData = this.planningRepository.create({
        month: createPlanningDto.month,
        value: createPlanningDto.value,
        hasCategory: createPlanningDto.hasCategory,
      });
      await this.planningRepository.save(planningData);

      planningData.hasCategory.map(async (item) => {
        const data = this.hasCategoriesRepository.create({
            planningId: item.planningId,
            categoryId: item.categoryId,
            valuePerCategory: item.valuePerCategory
        });
        return await this.hasCategoriesRepository.save(data);
       }
      )
  }

  findAll() {
    return `This action returns all planning`;
  }

  findOne(id: number) {
    return `This action returns a #${id} planning`;
  }

  update(id: number, updatePlanningDto: UpdatePlanningDto) {
    return `This action updates a #${id} planning`;
  }

  remove(id: number) {
    return `This action removes a #${id} planning`;
  }
}
