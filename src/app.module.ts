import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { ProjectModule } from './project/project.module';
import { Company } from './project/entities/company.entity';
import { BankAccount } from './project/entities/bank_account.entity';
import { Category } from './project/entities/category.entity';
import { Employee } from './project/entities/employee.entity';
import { Planning } from './project/entities/planning.entity';
import { Transactions } from './project/entities/transactions.entity';
import { Wage } from './project/entities/wage.entity';
require('dotenv').config()

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.MYSQL_DB_MY_USER,
      password: process.env.MYSQL_DB_PASSWORD,
      database: 'nest',
      entities: [
        //Aqui deve-se importa todas as entities que foram criadas
        User,
        Company,
        BankAccount,
        Category,
        Employee,
        Planning,
        Transactions,
        Wage
      ],

      //Sincroniza a criação e atualização das tabelas no banco de dados de forma automatica, porem não é recomendado usar no ambiente de produção, somente no de desenvolvimento.
      synchronize: true,
    }),
    UsersModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
