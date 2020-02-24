import { createParamDecorator } from '@nestjs/common';

import { IContact } from '../../contacts/interfaces';

export const QueryContact = createParamDecorator(
  (data, req): IContact => req.queryContact,
);
