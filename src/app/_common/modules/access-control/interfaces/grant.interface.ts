import { Role } from '../../../../roles/enums';

export interface IGrant {
  readonly role: Role;
  readonly resources: { [key: string]: { [key: string]: string[] } };
}
