import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanningDto } from './create-planning.dto';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdatePlanningDto extends PartialType(CreatePlanningDto) {
    @IsNotEmpty({message: 'O valor do orçamento deve ser informado'})
    @IsNumber({allowInfinity:false, allowNaN:false}, {message: 'O valor do orçamento deve ser um número'})
    value: number

    @IsNotEmpty({message:'O mês deve ser informado'})
    @IsString()
    month: string;

    @IsArray()
    hasCategory: []
}
