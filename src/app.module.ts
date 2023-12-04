import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { join } from 'path';
import { Category } from './entities/category.entity';
import { CompanyModule } from './company/company.module';
import { EmployeeModule } from './employee/employee.module';
import { SectorModule } from './sector/sector.module';
import { BackAccountModule } from './back-account/back-account.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.MYSQ_DB_USER,
      password: process.env.MYSQL_DB_PASSWORD,
      database: 'nest',
      migrationsRun: true,

      //Aqui deve-se importa todas as migrações que foram criadas
      migrations: [join(__dirname, 'migrations', '*')],

      //Aqui deve-se importa todas as entities que foram criadas
      entities: [join(__dirname, 'entities', '*'), Category],

      //Sincroniza a criação e atualização das tabelas no banco de dados de forma automatica, porem não é recomendado usar no ambiente de produção, somente no de desenvolvimento.
      synchronize: true,
    }),
    UsersModule,
    TransactionsModule,
    CompanyModule,
    EmployeeModule,
    SectorModule,
    BackAccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
