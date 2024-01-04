import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesAuthGuard } from 'src/auth/guards/roles.guard';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post(':companyId')
  @Roles(Role.admin, Role.counter)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  create(
    @Param('companyId') id: string,
    @Body() createEmployeeDto: CreateEmployeeDto,
  ) {
    return this.employeeService.create(+id, createEmployeeDto);
  }

  @Get('all/:companyId')
  @Roles(Role.admin, Role.counter)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  findAll(@Param('companyId') companyId: string) {
    // console.log(@Roles("ROLE_ADMIN");)
    return this.employeeService.findAll(+companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  @Roles(Role.admin, Role.manager)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }
}
