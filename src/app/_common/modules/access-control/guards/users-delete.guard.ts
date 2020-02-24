import { CanActivate, ExecutionContext, Injectable, MethodNotAllowedException } from '@nestjs/common';

import { UserService } from '../../../../users/services';

@Injectable()
export class UsersDeleteGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params, user } = request;
    let { queryUser } = request;

    if (params.id && user.id === params.id) {
      throw new MethodNotAllowedException(`Can't delete self.`);
    }

    if (!queryUser) {
      queryUser = await this.userService.findOneById(params.id);
      request.queryUser = queryUser;
    }

    if (queryUser.readonly) {
      throw new MethodNotAllowedException(
        `User ${queryUser.fullName} is protected.`,
      );
    }

    return true;
  }
}
