import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BackAccountService } from './back-account.service';
import { CreateBackAccountDto } from './dto/create-back-account.dto';
import { UpdateBackAccountDto } from './dto/update-back-account.dto';

@Controller('back-account')
export class BackAccountController {
  constructor(private readonly backAccountService: BackAccountService) {}

  @Post(':id')
  create(
    @Param('id') id: string,
    @Body() createBackAccountDto: CreateBackAccountDto,
  ) {
    return this.backAccountService.create(+id, createBackAccountDto);
  }

  @Get()
  findAll() {
    return this.backAccountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.backAccountService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBackAccountDto: UpdateBackAccountDto,
  ) {
    return this.backAccountService.update(+id, updateBackAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.backAccountService.remove(+id);
  }
}
