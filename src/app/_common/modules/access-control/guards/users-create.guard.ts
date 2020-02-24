import { CanActivate, ExecutionContext, Injectable, MethodNotAllowedException } from '@nestjs/common';

import { Role } from '../../../../roles/enums';
import { AccessControlService } from '../services';

@Injectable()
export class UsersCreateGuard implements CanActivate {
  constructor(private readonly accessControlService: AccessControlService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { body } = request;

    if (this.accessControlService.hasRole(body.roles, Role.Admin)) {
      throw new MethodNotAllowedException(`There can be only one.`);
    }

    return true;
  }
}
