import { Injectable } from '@nestjs/common';
import { CreateBackAccountDto } from './dto/create-back-account.dto';
import { UpdateBackAccountDto } from './dto/update-back-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccount } from 'src/entities/bank_account.entity';
import { Repository } from 'typeorm';
import { EmployeeService } from 'src/employee/employee.service';

@Injectable()
export class BackAccountService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountRepository: Repository<BankAccount>,
    private readonly employeeService: EmployeeService,
  ) {}
  async create(employeeId: number, createBackAccountDto: CreateBackAccountDto) {
    console.log(createBackAccountDto);

    const employee = await this.employeeService.findOne(employeeId);

    if (!employee) {
      throw new Error('não encontrada');
    }
    // employee.bankAccount.filter((item) => console.log(item.active));
    // const bank_account = this.bankAccountRepository.create({
    //   name: createBackAccountDto.name,
    //   agency: createBackAccountDto.agency,
    //   numberAccount: createBackAccountDto.numberAccount,
    //   employee: employee,
    //   active: true,
    // });
    // return await this.bankAccountRepository.save(bank_account);
  }
  async findAll() {
    return await this.bankAccountRepository.find();
  }

  async findOne(id: number) {
    return await this.bankAccountRepository.findOneBy({ id: id });
  }

  async update(id: number, updateEmployeeDto: UpdateBackAccountDto) {
    console.log(updateEmployeeDto);
    await this.bankAccountRepository.update(id, updateEmployeeDto);
    return this.bankAccountRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.bankAccountRepository.delete(id);
  }
}
