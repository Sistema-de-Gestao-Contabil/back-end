import { Module } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { PlanningController } from './planning.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planning } from 'src/entities/planning.entity';
import { Category } from 'src/entities/category.entity';
import { PlanningCategory } from 'src/entities/planning_category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Planning, Category, PlanningCategory])],
  controllers: [PlanningController],
  providers: [PlanningService],
})
export class PlanningModule {}
