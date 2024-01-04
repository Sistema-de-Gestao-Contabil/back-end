import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/entities/roles.entity';
import { Employee } from 'src/entities/employee.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    console.log('Entrou no create', createUserDto); // Adicione este log
    try {
      const role = await this.rolesRepository.findOne({
        where: { id: createUserDto.roleId },
      });

      const employee = await this.employeeRepository.findOne({
        where: { id: createUserDto.employeeId },
      });

      if (!role) {
        throw new Error('Função não encontrada');
      }

      if (!employee) {
        throw new Error('Funcionário não encontrado');
      }

      console.log(role);
      const createUser = this.usersRepository.create({
        email: createUserDto.email,
        password: await bcrypt.hash(createUserDto.password, 10),
        roles: role, // Corrigido para atribuir diretamente a entidade de Role
        employee: employee,
      });

      const result = await this.usersRepository.save(createUser);

      return {
        status: 201,
        result,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao criar usuário');
    }
  }

  async getRolesByNames(names: string[]) {
    const a = await this.rolesRepository.find({
      where: names.map((name) => ({ name })),
      select: ['id', 'name'],
    });
    console.log(a);
    return a;
  }

  async findAll() {
    return await this.usersRepository.find();
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
      select: ['password'],
      where: {
        id: id,
      },
    });
    let password: any;

    if (updateUserDto.password != '') {
      password = await bcrypt.hash(updateUserDto.password, 10);
    } else {
      password = findEmployee[0].password;
    }

    return this.usersRepository.save({
      id: id,
      email: updateUserDto.email,
      password: password,
    });
  }

  async remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
