import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import {Type} from '../../entities/transaction.entity'


export class CreateTransactioDto {

    //@IsNotEmpty({message: 'Um valor deve ser informado'})
    @IsOptional()
    @IsNumber({allowInfinity:false, allowNaN:false}, {message: 'O valor deve ser um número'})
    value?: number

    // @IsNotEmpty({message:'Uma descrição deve ser informada'})
    @IsOptional()
    @IsString()
    description?: string

    @IsNotEmpty({message: 'A data é obrigatório'})
    @IsString()
    date: string

    @IsNotEmpty({message: 'A data é obrigatório'})
    @IsString()
    type: Type

    //Informa se a despesa está paga ou não
    @IsNotEmpty()
    status: boolean

    @IsNotEmpty({message: 'É necessário escolher uma categoria'})
    @IsInt({message: 'O id da categoria deve ser um número'})
    categoryId: number

    @IsNotEmpty({message: 'Informe a empresa vinculada a essa transação'})
    companyId: number
}
