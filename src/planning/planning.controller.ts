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

  @Post(':companyId')
  create(
    @Param('companyId') id: string,
    @Body() createPlanningDto: CreatePlanningDto,
  ) {
    return this.planningService.create(+id, createPlanningDto);
  }

  @Get('list/:companyId')
  findAll(@Param('companyId') companyId: string) {
    return this.planningService.findAll(+companyId);
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
    try {
      const pdfBuffer = await this.planningService.generatePDF(+id);

      res.setHeader('Content-Type', 'application/pdf');
      res.status(200).end(pdfBuffer, 'binary');
    } catch (error) {
      res.status(error.status).send(error);
    }
  }
  @Get('/generate-pdf1/:id')
  generatePdf1(@Param('id') id: string) {
    return this.planningService.generatePDF(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlanningDto: UpdatePlanningDto,
  ) {
    return this.planningService.update(
      +id, updatePlanningDto
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planningService.remove(+id);
  }
}
