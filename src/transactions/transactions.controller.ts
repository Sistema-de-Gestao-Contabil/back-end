import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactioDto } from './dto/create-transactio.dto';
import { UpdateTransactioDto } from './dto/update-transactio.dto';
import { Response, Request } from 'express';

@Controller('transactions')
export class TransactiosController {
  constructor(private readonly transactiosService: TransactionsService) {}

  @Post()
  async create(@Res() response: Response, @Body() createTransactioDto: CreateTransactioDto) {
    const result = await this.transactiosService.create(createTransactioDto);

    return response.status(result.status).json(result)
  }

  @Get()
  async findAll(@Res() response: Response, @Req() request: Request) {
    const result = await this.transactiosService.findAll(request);
    return response.status(result.status).json(result)
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response: Response) {
    const result = await this.transactiosService.findOne(+id);
    return response.status(result.status).json(result)
  }

  @Patch()
  async update(@Body() updateTransactioDto: UpdateTransactioDto, @Req() request: Request, @Res() response: Response) {
    const result = await this.transactiosService.update(updateTransactioDto, request);
    return response.status(result.status).json(result)
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response: Response) {
    const result = await this.transactiosService.remove(+id);
    return response.status(result.status).json(result)
  }
}
