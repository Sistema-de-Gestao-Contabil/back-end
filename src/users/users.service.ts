import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  //Declarando o serviço do repositório da entidade User. Essa configuração permite trabalhar com a tabela users com o typeOrm neste arquivo
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ){}

  //O createUserDto é a classe que representa a estrutura dos dados que será enviado pela requisição para a criação de um user
  async create(createUserDto: CreateUserDto) {
    const createUser = this.usersRepository.create({
      name: createUserDto.name
    })

    return await this.usersRepository.save(createUser)
  }

  async findAll() {
    return await this.usersRepository.find()
  }

  async findOne(id: number) {
    return this.usersRepository.findBy({id})
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto)

  }

  async remove(id: number) {
    return this.usersRepository.delete(id)
  }
}
