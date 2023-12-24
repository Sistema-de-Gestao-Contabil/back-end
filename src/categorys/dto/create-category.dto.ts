import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'src/entities/category.entity';

//Usando o class-validator para validar os dados que são enviados pelo front end atraves da requisição.
export class CreateCategoryDto {
  //O campo name só sera validado se for uma string se não for sera retornado a messagem de erro que foi definida abixo
  @IsString({ message: 'O nome da categoria deve ser uma string' })
  @IsNotEmpty({ message: 'O nome da categoria deve ser informado' })
  name: string;

  @IsString({ message: 'O tipo da categoria deve ser uma string' })
  @IsNotEmpty({ message: 'O tipo da categoria deve ser informado' })
  type: Type;

  // @IsInt({ message: 'O id da empresa deve ser um número' })
  // @IsNotEmpty({ message: 'O nome da empresa deve ser informado' })
  // companyId: number;
}
