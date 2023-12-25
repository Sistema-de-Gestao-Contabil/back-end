import { Module } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { PlanningController } from './planning.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planning } from 'src/entities/planning.entity';
import { PlanningCategory } from 'src/entities/planning_category.entity';
import { Transaction } from 'src/entities/transaction.entity';
import { Company } from 'src/entities/company.entity';
import { CompanyService } from 'src/company/company.service';
import { SectorService } from 'src/sector/sector.service';
import { Sector } from 'src/entities/sector.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Planning, PlanningCategory, Transaction, Company, Sector])],
  controllers: [PlanningController],
  providers: [PlanningService, CompanyService, SectorService],
})
export class PlanningModule {}
