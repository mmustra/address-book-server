import { CanActivate, ExecutionContext, Injectable, MethodNotAllowedException } from '@nestjs/common';

import { Role } from '../../../../roles/enums';
import { UserService } from '../../../../users/services';
import { AccessControlService } from '../services';

@Injectable()
export class UsersEditGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly accessControlService: AccessControlService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params, body } = request;
    let { queryUser } = request;

    if (body.roles) {
      if (params.id && user.id === params.id) {
        throw new MethodNotAllowedException(`Can't change role for self.`);
      }

      if (this.accessControlService.hasRole(body.roles, Role.Admin)) {
        throw new MethodNotAllowedException(`There can be only one.`);
      }
    }

    if (!queryUser) {
      queryUser = await this.userService.findOneById(params.id);
      request.queryUser = queryUser;
    }

    if (queryUser.readonly) {
      throw new MethodNotAllowedException(
        `User ${queryUser.fullName} is protected.`,
      );
    }

    return true;
  }
}
