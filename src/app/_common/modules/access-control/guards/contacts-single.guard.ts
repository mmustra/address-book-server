import * as _ from 'lodash';
import { Role } from 'nest-access-control';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ContactService } from '../../../../contacts/services';
import * as enums from '../../../../roles/enums';
import { UserService } from '../../../../users/services';
import { AccessControlService } from '../services';

@Injectable()
export class ContactsSingleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accessControlService: AccessControlService,
    private readonly userService: UserService,
    private readonly contactService: ContactService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params } = request;
    let { queryContact } = request;
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    const { resource, action } = roles[0];

    const isUserAdmin = this.accessControlService.hasRole(
      user.roles,
      enums.Role.Admin,
    );

    if (isUserAdmin) {
      return true;
    }

    const userIds = await this.userService.getUserIdsByRoles();
    const adminIds = _.find(userIds, { role: enums.Role.Admin });
    if (!queryContact) {
      queryContact = await this.contactService.findOneById(params.id);
      request.queryContact = queryContact;
    }
    const isAdminResource = _.includes(
      adminIds.ids,
      queryContact.userId.toString(),
    );

    if (isAdminResource) {
      return false;
    }

    const permission = this.accessControlService.getOrFailPermissionForOwner(
      user.id,
      user.roles,
      queryContact.userId,
      resource,
      action,
    );

    return permission.granted;
  }
}
