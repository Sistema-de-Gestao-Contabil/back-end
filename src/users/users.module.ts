// roles-services.decorator.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { CheckIsRegistrationPipe } from './pipes/check-is-registration.pipe';
import { Roles } from 'src/entities/roles.entity';
import { Employee } from 'src/entities/employee.entity';

@Module({
  // Importando repositório da entidade User
  imports: [TypeOrmModule.forFeature([User, Roles, Employee])],
  controllers: [UsersController],
  providers: [
    UsersService,
    // Utilizando pipe de verificação de usuário já cadastrado
    CheckIsRegistrationPipe,
  ],
  exports: [UsersService],
})
export class UsersModule {}
