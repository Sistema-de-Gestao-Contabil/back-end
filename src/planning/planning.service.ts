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

      if(!planningData){
        throw new Error('Não foi possível criar o planejamento')
      }

      planningData.hasCategory.map(async (item) => {
        const data = this.hasCategoriesRepository.create({
            planningId: planningData,
            categoryId: item.categoryId,
            valuePerCategory: item.valuePerCategory
        });
        return await this.hasCategoriesRepository.save(data);
       }
      )
      return planningData
  }

  async remove(id: number) {
    const question = await this.planningRepository.findOne({
      relations: {
          hasCategory: true,
      },
      where: { id: id }
    })
    if(question){
      //Apagando relacionamento
      question.hasCategory.forEach(async (item) => await this.hasCategoriesRepository.delete(item.id))
      //Apagando item de planejamento
      return await this.planningRepository.delete(question.id)
    }else{
      throw new Error(`Não foi possível apagar o item de id ${{id}}`)
    }
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


}
