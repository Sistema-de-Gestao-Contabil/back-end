import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/entities/employee.entity';
import { Company } from 'src/entities/company.entity';
import { CompanyService } from 'src/company/company.service';
import { Sector } from 'src/entities/sector.entity';
import { SectorService } from 'src/sector/sector.service';
// import { Wage } from 'src/entities/wage.entity';
// import { WageService } from 'src/wage/wage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Company, Sector])],

  controllers: [EmployeeController],
  providers: [EmployeeService, CompanyService, SectorService],
})
export class EmployeeModule {}
