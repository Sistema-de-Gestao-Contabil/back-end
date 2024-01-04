import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { Roles } from 'src/entities/roles.entity';
import { Employee } from 'src/entities/employee.entity';


@Injectable()
export class UsersService {
  //Declarando o serviço do repositório da entidade User. Essa configuração permite trabalhar com a tabela users com o typeOrm neste arquivo
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>

  ){}

  //O createUserDto é a classe que representa a estrutura dos dados que será enviado pela requisição para a criação de um user
  async create(createUserDto: CreateUserDto) {

    const findUsers = await this.usersRepository.find()

    //Garentido que o primeiro usuário id 1 seja o gestor inicial
    if(findUsers.length == 0){

      //Busca o funcionário que acabou de ser cadastrado
      const findEmployee = await this.employeeRepository.find({
        where:{
          id: createUserDto.employeeId
        }
      })

      if(findEmployee.length > 0){

        //Criando user
        const createUser = this.usersRepository.create({
          id: 1,
          email: createUserDto.email,
          password: await bcrypt.hash(createUserDto.password, 10)
        })
  
        await this.usersRepository.save(createUser)
  
        //Criando role
        const createRole = this.rolesRepository.create({
          type: createUserDto.type
        })
  
        createRole.employees = findEmployee

        const result = await this.rolesRepository.save(createRole)
        return{
          status: 201,
          result
        }
      }

      else{
        return{
          status: 400,
          message: 'Funcionário não encontrado.'
        }
      }
  
    }

    else{
      const createUser = this.usersRepository.create({
        email: createUserDto.email,
        password: await bcrypt.hash(createUserDto.password, 10)
      })
  
      const result = await this.usersRepository.save(createUser)
      return{
        status: 201,
        result
      }
    }

  }

  async findAll() {
    return await this.usersRepository.find()
  }

  
  async findOne(id: number) {
    return this.usersRepository.findOne({
      relations: {
        employee: true,
      },
      where: { id: id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const findEmployee = await this.usersRepository.find({
      select: ["password"],
      where:{
        id: id
      }
    })
    let password: any
    
    if(updateUserDto.password != ""){
      password = await bcrypt.hash(updateUserDto.password, 10)
    }else{
      password = findEmployee[0].password
    }

    return this.usersRepository.save({
      id: id,
      email: updateUserDto.email,
      password: password
    })

  }

  async remove(id: number) {
    return this.usersRepository.delete(id)
  }
}
