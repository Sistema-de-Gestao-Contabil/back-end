import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Response } from 'express';
import { IsPublic } from 'src/auth/decorators/is-puplic.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesAuthGuard } from 'src/auth/guards/roles.guard';

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
  @Roles(Role.admin)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
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
  @Roles(Role.admin, Role.manager)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
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
