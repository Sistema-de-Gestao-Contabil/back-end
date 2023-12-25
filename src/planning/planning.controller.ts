/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { PlanningService } from './planning.service';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { UpdatePlanningDto } from './dto/update-planning.dto';
import { Response } from 'express';
const path = require('path');
const fs = require('fs');
@Controller('planning')
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  @Post()
  create(@Body() createPlanningDto: CreatePlanningDto) {
    return this.planningService.create(createPlanningDto);
  }

  @Get()
  findAll() {
    return this.planningService.findAll();
  }

  // @Get('/despesas')
  // findDespesas() {
  //   return this.planningService.findDespesas();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planningService.findOne(+id);
  }

  @Get('/generate-pdf/:id')
  // @Render('report-template')
  async generatePdf(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<void> {
    console.log(path.join(__dirname, '../../views/report-template.hbs'));
    try {
      const pdfBuffer = await this.planningService.generatePDF(+id);

      res.setHeader('Content-Type', 'application/pdf');
      res.status(200).end(pdfBuffer, 'binary');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      res.status(500).send('Erro ao gerar PDF');
    }
  }
  @Get('/generate-pdf1/:id')
  generatePdf1(@Param('id') id: string) {
    return this.planningService.generatePDF(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    requestBody: {
      updatePlanningDto: UpdatePlanningDto;
      planningCategoryId: number;
    },
  ) {
    return this.planningService.update(
      +id,
      requestBody.updatePlanningDto,
      requestBody.planningCategoryId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planningService.remove(+id);
  }
}
