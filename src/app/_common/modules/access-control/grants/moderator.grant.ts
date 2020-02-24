import { Role } from '../../../../roles/enums';
import { Resource } from '../enums';
import { IGrant } from '../interfaces/grant.interface';

class ModeratorGrant implements IGrant {
  readonly role = Role.Moderator;
  readonly resources = {
    [Resource.Users]: {
      'read:any': ['*'],
      'update:own': ['*'],
    },
    [Resource.Contacts]: {
      'create:own': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:own': ['*'],
    },
  };
}

export { ModeratorGrant };
