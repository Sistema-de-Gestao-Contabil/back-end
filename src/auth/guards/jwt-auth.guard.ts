// NestJS
import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  // Password
  import { AuthGuard } from '@nestjs/passport';
  // Decorators
  import { IS_PUBLIC_KEY } from 'src/auth/decorators/is-puplic.decorator';
  // Error Handling
  //import { UnauthorizedError } from '../errors/unauthorized.error';
  
  @Injectable()
  export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
      super();
    }
  
    canActivate(context: ExecutionContext): Promise<boolean> | boolean {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
  
      if (isPublic) {
        return true;
      }
  
      const canActivate = super.canActivate(context);
  
      if (typeof canActivate === 'boolean') {
        return canActivate;
      }
  
      const canActivatePromise = canActivate as Promise<boolean>;
  
      return canActivatePromise.catch((error) => {
        throw new Error(error)
      });
    }
  }