import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBackAccountDto {
  @IsNotEmpty({ message: 'Um valor deve ser informado' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Um valor deve ser informado' })
  @IsString()
  numberAccount: string;

  @IsNotEmpty({ message: 'Um valor deve ser informado' })
  @IsString()
  agency: string;

  @IsOptional()
  @IsBoolean()
  active: boolean;
}
