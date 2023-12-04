import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BankAccount } from 'src/entities/bank_account.entity';
import { EmployeeStatus } from 'src/entities/employee.entity';
// import { CreateWageDto } from 'src/wage/dto/create-wage.dto';

export class CreateEmployeeDto {
  @IsNotEmpty({ message: 'Um valor deve ser informado' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Um valor deve ser informado' })
  @IsString()
  office: string;

  @IsNotEmpty({ message: 'Um valor deve ser informado' })
  @IsString()
  cpf: string;

  @IsNotEmpty({ message: 'Um valor deve ser informado' })
  @IsString()
  phone: string;

  @IsNotEmpty({ message: 'Um valor deve ser informado' })
  @IsNumber()
  wage: number;

  @IsNotEmpty({ message: 'Um valor deve ser informado' })
  @IsInt()
  paymentDay: number;

  @IsString()
  @IsOptional()
  dtBirth: string;

  status: EmployeeStatus;

  bankAccount: BankAccount[];
}
