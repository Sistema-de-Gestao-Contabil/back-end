import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { CategorysService } from './categorys.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { response, Response } from 'express';

@Controller('categorys')
export class CategorysController {
  constructor(private readonly categorysService: CategorysService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto, @Res() response: Response) {
    const result = await this.categorysService.create(createCategoryDto);
    return  response.status(result.status).json(result)
  }

  @Get()
  async findAll(@Res() response: Response) {
    const result = await this.categorysService.findAll();
    return response.status(result.status).json(result)
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response: Response) {
    const result = await this.categorysService.findOne(+id);
    return response.status(result.status).json(result)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Res() response: Response) {
    const result = await this.categorysService.update(+id, updateCategoryDto);
    return response.status(result.status).json(result)
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response: Response) {
    const result = await this.categorysService.remove(+id);
    return response.status(result.status).json(result) 
  }
}
