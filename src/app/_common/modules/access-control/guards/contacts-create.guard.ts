import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { Role } from '../../../../roles/enums';
import { AccessControlService } from '../services';

@Injectable()
export class ContactsCreateGuard implements CanActivate {
  constructor(private readonly accessControlServie: AccessControlService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, body } = context.switchToHttp().getRequest();

    if (this.accessControlServie.hasRole(user.roles, Role.Admin)) {
      return true;
    } else if (body.userId && user.id !== body.userId) {
      throw new ForbiddenException('Forbidden resource');
    }

    return true;
  }
}
