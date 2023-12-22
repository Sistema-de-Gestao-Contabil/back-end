import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { CategorysService } from './categorys.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { response, Response, request, Request } from 'express';

@Controller('categorys')
export class CategorysController {
  constructor(private readonly categorysService: CategorysService) {}

  @Post(':companyId')
  async create(
    @Param('companyId') companyId: string,
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() response: Response,
  ) {
    const result = await this.categorysService.create(
      +companyId,
      createCategoryDto,
    );
    return response.status(result.status).json(result);
  }
  @Get()
  async findAll(@Res() response: Response) {
    const result = await this.categorysService.findAll();
    return response.status(result.status).json(result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response: Response) {
    const result = await this.categorysService.findOne(+id);
    return response.status(result.status).json(result);
  }

  @Patch()
  async update(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    const result = await this.categorysService.update(
      updateCategoryDto,
      request,
    );
    return response.status(result.status).json(result);
  }

  @Delete()
  async remove(
    @Param('id') id: string,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    const result = await this.categorysService.remove(request);
    return response.status(result.status).json(result);
  }
}
