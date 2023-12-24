import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
require('dotenv').config()
import { join } from 'path';
import { Category } from './entities/category.entity';
import { APP_GUARD } from '@nestjs/core';
// import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
// import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.MYSQL_DB_MY_USER,
      password: process.env.MYSQL_DB_PASSWORD,
      database: 'nest',
      migrationsRun: true,

      //Aqui deve-se importa todas as migrações que foram criadas
      migrations: [
        join(__dirname, 'migrations', '*')
      ],

      //Aqui deve-se importa todas as entities que foram criadas
      entities: [
        join(__dirname, 'entities', '*'),
        Category
      ],

      //Sincroniza a criação e atualização das tabelas no banco de dados de forma automatica, porem não é recomendado usar no ambiente de produção, somente no de desenvolvimento.
      synchronize: false,


    }),
    UsersModule,
    TransactionsModule,
    // AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService,
  //   {
  //     provide: APP_GUARD,
  //     // useClass: JwtAuthGuard,
  //   },
   ],
})
export class AppModule { }
