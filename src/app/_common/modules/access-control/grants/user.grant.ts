import { Role } from '../../../../roles/enums';
import { Resource } from '../enums';
import { IGrant } from '../interfaces/grant.interface';

class UserGrant implements IGrant {
  readonly role = Role.User;
  readonly resources = {
    [Resource.Users]: {
      'read:own': ['*'],
      'update:own': ['*'],
    },
    [Resource.Contacts]: {
      'create:own': ['*'],
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
  };
}

export { UserGrant };
