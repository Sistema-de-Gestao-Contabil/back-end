import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CheckIsRegistrationPipe } from './pipes/check-is-registration.pipe';

@Module({
  //Importando repositório da entidade User
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    //Utilizando pipe de verificção de usuário já cadastrado
    CheckIsRegistrationPipe
  ],
})
export class UsersModule {}
