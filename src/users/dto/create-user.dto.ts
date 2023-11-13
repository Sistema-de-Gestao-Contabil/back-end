import { IsString } from 'class-validator';

//Usando o class-validator para validar os dados que são enviados pelo front end atraves da requisição.
export class CreateUserDto {
    //O campo name só sera validado se for uma string se não for sera retornado a messagem de erro que foi definida abixo
    @IsString({message: "O nome de ser informado"})
    name: string
}
