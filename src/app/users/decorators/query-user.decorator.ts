import { createParamDecorator } from '@nestjs/common';

import { IUser } from '../interfaces';

export const QueryUser = createParamDecorator(
  (data, req): IUser => req.queryUser,
);
