import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactiosController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Transaction} from '../entities/transaction.entity'
import { Category } from 'src/entities/category.entity';
import { Company } from 'src/entities/company.entity';
import { Employee } from 'src/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Category, Company, Employee])],
  controllers: [TransactiosController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
