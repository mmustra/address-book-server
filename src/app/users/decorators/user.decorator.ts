import { createParamDecorator } from '@nestjs/common';

import { IUser } from '../interfaces';

export const User = createParamDecorator((data, req): IUser => req.user);
