import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { Sector } from 'src/entities/sector.entity';
import { SectorService } from 'src/sector/sector.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Sector])],

  controllers: [CompanyController],
  providers: [CompanyService, SectorService],
})
export class CompanyModule {}
