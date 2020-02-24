import { createParamDecorator } from '@nestjs/common';

import { IUserIdsRole } from '../interfaces';

export const UserIdsRole = createParamDecorator(
  (data, req): IUserIdsRole[] => req.userIdsRole,
);
