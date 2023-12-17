import { Module } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { PlanningController } from './planning.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planning } from 'src/entities/planning.entity';
import { PlanningCategory } from 'src/entities/planning_category.entity';
import { Transaction } from 'src/entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Planning, PlanningCategory, Transaction])],
  controllers: [PlanningController],
  providers: [PlanningService],
})
export class PlanningModule {}
