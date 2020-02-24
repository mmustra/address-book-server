import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { Role } from '../../../../roles/enums';
import { UserService } from '../../../../users/services';
import { AccessControlService } from '../services';

@Injectable()
export class ContactsReadAllGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly accessControlServie: AccessControlService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userIdsRole = await this.userService.getUserIdsByRoles();
    request.userIdsRole = userIdsRole;

    if (
      request.query.any &&
      this.accessControlServie.hasRole(request.user.roles, Role.User)
    ) {
      throw new ForbiddenException('Forbidden resource');
    }

    return true;
  }
}
