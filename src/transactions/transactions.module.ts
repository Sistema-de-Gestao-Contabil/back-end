import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactiosController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { Category } from 'src/entities/category.entity';
import { Company } from 'src/entities/company.entity';
import { Employee } from 'src/entities/employee.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { CompanyService } from 'src/company/company.service';
import { SectorService } from 'src/sector/sector.service';
import { CategorysService } from 'src/categorys/categorys.service';
import { Sector } from 'src/entities/sector.entity';
import { ReportService } from 'src/report/report.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      Category,
      Company,
      Employee,
      Sector,
    ]),
  ],
  controllers: [TransactiosController],
  providers: [
    TransactionsService,
    SectorService,
    EmployeeService,
    CompanyService,
    CategorysService,
    ReportService,
  ],
})
export class TransactionsModule {}
