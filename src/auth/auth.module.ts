import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoginValidationMiddleware } from './middlewares/login-validation.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
require('dotenv').config();


@Module({
  imports: [ JwtModule.register({
    secret: process.env.JWT_KEY,
    signOptions: {expiresIn: '30d'},
  }),
  TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy]
})

export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(LoginValidationMiddleware).forRoutes('login');
    }
}