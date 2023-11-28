import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactioDto } from './dto/create-transactio.dto';
import { UpdateTransactioDto } from './dto/update-transactio.dto';
import { response, Response } from 'express';

@Controller('transactions')
export class TransactiosController {
  constructor(private readonly transactiosService: TransactionsService) {}

  @Post()
  async create(@Res() response: Response, @Body() createTransactioDto: CreateTransactioDto) {
    const result = await this.transactiosService.create(createTransactioDto);

    return response.status(200).json(result)
  }

  @Get()
  async findAll(@Res() response: Response) {
    const result = await this.transactiosService.findAll();
    return response.status(200).json(result)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.transactiosService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTransactioDto: UpdateTransactioDto) {
    return this.transactiosService.update(+id, updateTransactioDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.transactiosService.remove(+id);
  }
}
