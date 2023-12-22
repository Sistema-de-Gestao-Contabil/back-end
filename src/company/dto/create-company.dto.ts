import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { CreateCategoryDto } from 'src/categorys/dto/create-category.dto';
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';
export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Um valor deve ser informado' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Um valor deve ser informado' })
  @IsString()
  address: string;

  @IsNotEmpty({ message: 'Um valor deve ser informado' })
  @IsString()
  email: string;

  @IsNotEmpty({ message: 'Um valor deve ser informado' })
  @IsString()
  phone: string;

  @IsNotEmpty({ message: 'Um valor deve ser informado' })
  @IsInt()
  sectorId: number;

  employee: CreateEmployeeDto[];
  categorys: CreateCategoryDto[];
}
