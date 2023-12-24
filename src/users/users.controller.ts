import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CheckIsRegistrationPipe } from './pipes/check-is-registration.pipe';

@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly checkIsRegistrationPipe: CheckIsRegistrationPipe,
    ) {}

  @Post()
  //O createUserDto é a classe que representa a estrutura dos dados que será enviado pela requisição para a criação de um user
  async create(@Body() createUserDto: CreateUserDto) {
    //Usando pipe personalizado para verificação de usuário já cadastrado
    await this.checkIsRegistrationPipe.transform(createUserDto)
    return await this.usersService.create(createUserDto);
    // return this.usersService.findByEmail('');
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':email')
  async findOne(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }

  @Patch(':id')
  //O updateUserDto é a classe que representa a estrutura dos dados que será enviado pela requisição para a atualização de um user
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }
}
