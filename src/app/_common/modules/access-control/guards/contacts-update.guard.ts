import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { ContactService } from '../../../../contacts/services';
import { Role } from '../../../../roles/enums';
import { AccessControlService } from '../services';

@Injectable()
export class ContactsUpdateGuard implements CanActivate {
  constructor(
    private readonly accessControlServie: AccessControlService,
    private readonly contactService: ContactService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, body, params } = request;
    let { queryContact } = request;

    if (this.accessControlServie.hasRole(user.roles, Role.Admin)) {
      return true;
    }

    if (!queryContact) {
      queryContact = await this.contactService.findOneById(params.id);
      request.queryContact = queryContact;
    }

    if (body.userId && queryContact.userId.toString() !== body.userId) {
      throw new ForbiddenException('Forbidden resource');
    }

    return true;
  }
}
