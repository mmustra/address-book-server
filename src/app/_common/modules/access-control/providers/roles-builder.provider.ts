import * as _ from 'lodash';
import { RolesBuilder } from 'nest-access-control';
import { ROLES_BUILDER_TOKEN } from 'nest-access-control/constants';

import { RoleService } from '../../../../roles/services';
import * as grantClasses from '../grants';

const rolesBuilderProvider = {
  provide: ROLES_BUILDER_TOKEN,
  inject: [RoleService],
  useFactory: async (roleService: RoleService): Promise<RolesBuilder> => {
    const roles = await roleService.getAll();
    const grants = _.map(grantClasses, Grant => new Grant());
    const validGrants = _.reduce(
      roles,
      (acc, { name: roleName }) => {
        const validGrant = _.find(grants, grant => grant.role === roleName);
        if (validGrant) {
          acc[validGrant.role] = {
            ...validGrant.resources,
          };
        }
        return acc;
      },
      {},
    );

    return new RolesBuilder(validGrants);
  },
};

export { rolesBuilderProvider };
