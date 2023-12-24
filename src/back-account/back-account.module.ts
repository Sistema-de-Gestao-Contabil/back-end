import { Module } from '@nestjs/common';
import { BackAccountService } from './back-account.service';
import { BackAccountController } from './back-account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccount } from 'src/entities/bank_account.entity';
import { Employee } from 'src/entities/employee.entity';
import { Company } from 'src/entities/company.entity';
import { Sector } from 'src/entities/sector.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { SectorService } from 'src/sector/sector.service';
import { CompanyService } from 'src/company/company.service';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccount, Employee, Company, Sector])],

  controllers: [BackAccountController],
  providers: [
    BackAccountService,
    EmployeeService,
    SectorService,
    CompanyService,
  ],
})
export class BackAccountModule {}
