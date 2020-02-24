import { IContact } from '../../contacts/interfaces';
import { Role } from '../../roles/enums';

export interface IUser {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  readonly: boolean;
  roles: Role[];
  avatarUrl: string;
  contactsCount: number;
  contacts?: IContact[];
  createdAt: string;
  updatedAt: string;
}
