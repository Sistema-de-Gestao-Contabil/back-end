import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('RolesAuthGuard sendo chamado.');

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      // Nenhuma role específica requerida, então o acesso é permitido
      return true;
    }
    console.log('Roles necessárias:', requiredRoles);

    if (!requiredRoles || requiredRoles.length === 0) {
      console.log('Nenhuma role específica requerida. Acesso permitido.');
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    console.log(user);
    // const { user } = context.switchToHttp().getRequest();

    if (!user) {
      console.log('Usuário n tem.');
      //   throw new ForbiddenException('Usuário ou roles ausentes.');
    }

    console.log('Roles do usuário:', user.roles);

    const hasRequiredRole = requiredRoles.includes(user.roles);

    // // Verifica se o usuário tem pelo menos uma das roles necessárias
    // const hasRequiredRole = user.roles.some((role: string) =>
    //   requiredRoles.includes(role),
    // );
    console.log(hasRequiredRole);
    if (!hasRequiredRole) {
      console.log(
        'Usuário não tem permissão para acessar este recurso. Acesso negado.',
      );
      throw new ForbiddenException(
        'Usuário não tem permissão para acessar este recurso.',
      );
    }
    console.log('Acesso permitido.');

    // Se o usuário tem a role necessária, permitir o acesso
    return true;

    // if (!hasRequiredRole) {
    //   console.log('Usuário não tem permissão para acessar este recurso.');
    //   throw new ForbiddenException(
    //     'Usuário não tem permissão para acessar este recurso.',
    //   );
    // }

    return true;
  }
}
