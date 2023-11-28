import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactioDto } from './create-transactio.dto';

export class UpdateTransactioDto extends PartialType(CreateTransactioDto) {}
