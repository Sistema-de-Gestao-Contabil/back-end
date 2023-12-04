import { PartialType } from '@nestjs/mapped-types';
import { CreateBackAccountDto } from './create-back-account.dto';

export class UpdateBackAccountDto extends PartialType(CreateBackAccountDto) {}
