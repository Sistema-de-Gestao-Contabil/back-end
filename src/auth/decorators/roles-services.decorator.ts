// roles-services.decorator.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RolesDecoratorService {
  constructor(private readonly usersService: UsersService) {}

  async getRoleIds(...roles: string[]) {
    const rolesEntities = await this.usersService.getRolesByNames(roles);
    const roleIds = rolesEntities.map(
      (role: { id: number; name: string }) => role.id,
    );
    console.log('Role Ids:', roleIds); // Log role ids
    return roleIds;
  }
}
