import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CheckIsRegistrationPipe } from './pipes/check-is-registration.pipe';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly checkIsRegistrationPipe: CheckIsRegistrationPipe,
  ) {}

  @Post()
  //O createUserDto é a classe que representa a estrutura dos dados que será enviado pela requisição para a criação de um user
  async create(@Body() createUserDto: CreateUserDto) {
    //Usando pipe personalizado para verificação de usuário já cadastrado
    await this.checkIsRegistrationPipe.transform(createUserDto);
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  //O updateUserDto é a classe que representa a estrutura dos dados que será enviado pela requisição para a atualização de um user
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
