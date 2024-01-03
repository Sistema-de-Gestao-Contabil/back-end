import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee, EmployeeStatus } from 'src/entities/employee.entity';
import { Repository } from 'typeorm';
import { CompanyService } from 'src/company/company.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private readonly companyService: CompanyService,
  ) {}
  async create(companyId: number, createEmployeeDto: CreateEmployeeDto) {
    const company = await this.companyService.findOne(companyId);

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }
    const cpf = createEmployeeDto.cpf;
    const cpfAlreadyExists = await this.employeeRepository.findOne({
      where: { cpf: cpf },
    });

    console.log(cpfAlreadyExists);

    if (cpfAlreadyExists) {
      throw new ConflictException('CPF já em uso');
    }

    const employee = this.employeeRepository.create({
      name: createEmployeeDto.name,
      cpf: createEmployeeDto.cpf,
      office: createEmployeeDto.office,
      phone: createEmployeeDto.phone,
      dtBirth: createEmployeeDto.dtBirth,
      status: createEmployeeDto.status,
      wage: createEmployeeDto.wage ? createEmployeeDto.wage : 0.0,
      paymentDay: createEmployeeDto.paymentDay
        ? createEmployeeDto.paymentDay
        : 1,
      company: company,
    });

    return await this.employeeRepository.save(employee);
  }

  async findAll(companyId: number) {
    return await this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.bankAccount', 'bankAccount')
      .where('employee.companyId = :companyId', { companyId })
      .andWhere('employee.status != :rescissionStatus', {
        rescissionStatus: EmployeeStatus.RESCISÃO,
      })
      .orderBy('bankAccount.active', 'DESC')
      .getMany();
  }

  async findOne(id: number) {
    return await this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.bankAccount', 'bankAccount')
      .where({ id })
      .orderBy('bankAccount.active', 'DESC')
      .getOne();
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    console.log({ updateEmployeeDto: updateEmployeeDto });
    const cpf = updateEmployeeDto.cpf;
    const cpfAlreadyExists = await this.employeeRepository.findOne({
      where: { cpf: cpf },
    });
    if (cpfAlreadyExists && id != cpfAlreadyExists.id) {
      throw new ConflictException('CPF já em uso');
    }
    await this.employeeRepository.update(id, updateEmployeeDto);
    return this.employeeRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.employeeRepository.update(id, {
      status: EmployeeStatus.RESCISÃO,
    });
  }
}
