import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//Criando pipe de validação personalizado que faz a verificação se o name já foi cadastrado
@Injectable()
export class CheckIsRegistrationPipe implements PipeTransform<CreateUserDto> {
  //Declarando serviço do repositório da entidade User
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ){}

  async transform(value: CreateUserDto) {
    
    //Se o nome de usuário já existe no banco de dados
    const findUser = await this.usersRepository.find({
      where: {
        email: value.email
      }
    })

    if(findUser.length > 0){
      throw new BadRequestException('Esse email de usuário já esta cadastrado')
    }
    
    return value;

  }
}
