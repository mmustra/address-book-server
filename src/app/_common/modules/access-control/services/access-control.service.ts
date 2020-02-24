import { Permission } from 'accesscontrol';
import * as _ from 'lodash';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';

import { ForbiddenException, Injectable } from '@nestjs/common';

import { Role } from '../../../../roles/enums';
import { Action, Resource } from '../enums';

@Injectable()
export class AccessControlService {
  constructor(@InjectRolesBuilder() private readonly ac: RolesBuilder) {}

  hasRole(role: Role | Role[], queryRole: Role): boolean {
    if (!role) {
      return false;
    }
    if (!_.isArray(role)) {
      role = [role as Role];
    }

    return role.includes(queryRole);
  }

  getOrFailPermissionForOwner(
    ownerId: string,
    ownerRoles: Role[],
    foreignId: string,
    resource: Resource | string,
    action: Action | string,
  ): Permission {
    let permission = this.ac.can(ownerRoles)[`${action}Any`](resource);

    if (permission.granted) {
      return permission;
    }

    permission = this.ac.can(ownerRoles)[`${action}Own`](resource);

    if (permission.granted && ownerId.toString() === foreignId.toString()) {
      return permission;
    }

    throw new ForbiddenException('Forbiden resource');
  }
}
