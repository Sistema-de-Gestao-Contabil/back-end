import { Module } from '@nestjs/common';
import { CategorysService } from './categorys.service';
import { CategorysController } from './categorys.controller';
import { Category } from 'src/entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { Sector } from 'src/entities/sector.entity';
import { CompanyService } from 'src/company/company.service';
import { SectorService } from 'src/sector/sector.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Company, Sector])],
  controllers: [CategorysController],
  providers: [CategorysService, CompanyService, SectorService],
})
export class CategorysModule {}
