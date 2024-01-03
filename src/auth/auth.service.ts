import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  login(user: User): UserToken {
    //Trasnforma o user em um jwt
    console.log(user);

    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.name,
    };

    const jwtToken = this.jwtService.sign(payload);
    return {
      access_token: jwtToken,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .where('user.email = :email', { email })
      .getOne();

    if (user) {
      // Checar se a senha informada corresponde a hash que esta no banco

      const isPasswordValid = await bcrypt.compare(password, user?.password);

      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
        };
      }
    }
    // Se chegar aqui, significa que não encontrou um user e/ou a senha não corresponde
    throw new Error('Email ou senha fornecidos estão incorretos');
  }
}
