import { Role } from '../../../../roles/enums';
import { Resource } from '../enums';
import { IGrant } from '../interfaces/grant.interface';

class AdminGrant implements IGrant {
  readonly role = Role.Admin;
  readonly resources = {
    [Resource.Roles]: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    [Resource.Users]: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    [Resource.Contacts]: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
  };
}

export { AdminGrant };
