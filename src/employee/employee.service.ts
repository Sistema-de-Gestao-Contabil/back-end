import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee, EmployeeStatus } from 'src/entities/employee.entity';
import { Not, Repository } from 'typeorm';
import { CompanyService } from 'src/company/company.service';

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
      throw new Error('Empresa não encontrada');
    }
    const employee = this.employeeRepository.create({
      name: createEmployeeDto.name,
      cpf: createEmployeeDto.cpf,
      office: createEmployeeDto.office,
      phone: createEmployeeDto.phone,
      dtBirth: createEmployeeDto.dtBirth,
      status: createEmployeeDto.status,
      wage: createEmployeeDto.wage,
      paymentDay: createEmployeeDto.paymentDay,
      company: company,
    });

    return await this.employeeRepository.save(employee);
  }

  async findAll(companyId: number) {
    return await this.employeeRepository.find({
      where: {
        company: { id: companyId },
        status: Not(EmployeeStatus.RESCISÃO),
      },
      relations: { bankAccount: true },
    });
  }

  async findOne(id: number) {
    return this.employeeRepository.findOne({
      where: { id },
      relations: { bankAccount: true },
    });
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    await this.employeeRepository.update(id, updateEmployeeDto);
    return this.employeeRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.employeeRepository.update(id, {
      status: EmployeeStatus.RESCISÃO,
    });
  }
}
