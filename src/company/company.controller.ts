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
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Response } from 'express';
import { IsPublic } from 'src/auth/decorators/is-puplic.decorator';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @IsPublic()
  async createCompany(
    @Res() response: Response,
    @Body() createCompanyDto: CreateCompanyDto,
  ) {
    const result = await this.companyService.create(createCompanyDto);
    return response.status(200).json(result);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }

  // @Post('/create-sector')
  // async createSector(
  //   @Res() response: Response,
  //   @Body() createSectorDto: CreateSectorDto,
  // ) {
  //   const result = await this.companyService.createSector(createSectorDto);
  //   return response.status(200).json(result);
  // }
}
