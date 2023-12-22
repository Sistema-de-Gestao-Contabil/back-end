import { IsNotEmpty, IsString } from 'class-validator';
import { CreateCompanyDto } from 'src/company/dto/create-company.dto';
export class CreateSectorDto {
  @IsNotEmpty({ message: 'Um valor deve ser informado' })
  @IsString()
  name: string;
  company: CreateCompanyDto[];
}
