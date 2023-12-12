import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from 'src/transactions/transactions.service';
import { Transaction } from 'src/entities/transaction.entity';
import { Company } from 'src/entities/company.entity';
import { CompanyService } from 'src/company/company.service';
import { Category } from 'src/entities/category.entity';
import { Sector } from 'src/entities/sector.entity';
import { CategorysService } from 'src/categorys/categorys.service';
import { SectorService } from 'src/sector/sector.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Company, Category, Sector])],

  controllers: [ReportController],
  providers: [
    ReportService,
    TransactionsService,
    CompanyService,
    CategorysService,
    SectorService,
  ],
})
export class ReportModule {}
