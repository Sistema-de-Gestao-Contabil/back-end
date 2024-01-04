import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    //O campo name só sera validado se for uma string se não for sera retornado a messagem de erro que foi definida abixo
    @IsString({message: "O nome deve ser informado"})
    email: string

    @IsOptional()
    @IsString({message: "Uma senha deve ser informada!"})
    password: string
}