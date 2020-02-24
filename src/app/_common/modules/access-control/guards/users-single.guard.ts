import * as _ from 'lodash';
import { Role } from 'nest-access-control';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import * as enums from '../../../../roles/enums';
import { UserService } from '../../../../users/services';
import { AccessControlService } from '../services';

@Injectable()
export class UsersSingleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accessControlService: AccessControlService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params } = request;
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    const { resource, action } = roles[0];
    let { queryUser } = request;

    const isUserAdmin = this.accessControlService.hasRole(
      user.roles,
      enums.Role.Admin,
    );

    if (isUserAdmin) {
      return true;
    }

    const userIds = await this.userService.getUserIdsByRoles();
    const adminIds = _.find(userIds, { role: enums.Role.Admin });
    if (!queryUser) {
      queryUser = await this.userService.findOneById(params.id);
      request.queryUser = queryUser;
    }
    const isAdminResource = _.includes(adminIds.ids, queryUser.id.toString());

    if (isAdminResource) {
      return false;
    }

    const permission = this.accessControlService.getOrFailPermissionForOwner(
      user.id,
      user.roles,
      params.id,
      resource,
      action,
    );

    return permission.granted;
  }
}
