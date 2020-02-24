import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { IUser } from '../../users/interfaces';
import { UserService } from '../../users/services';
import { IJwtPayload, IToken } from '../interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(
    credentials: Pick<
      IUser,
      'firstName' | 'lastName' | 'password' | 'email' | 'avatarUrl'
    >,
  ): Promise<IToken> {
    const { id: userId } = await this.userService.create(credentials);
    const token = this.jwtService.sign({ userId });
    return { token };
  }

  async login(credentials: Pick<IUser, 'email' | 'password'>): Promise<IToken> {
    const { id: userId } = await this.userService.findOneByCredentials(
      credentials,
    );
    const token = this.jwtService.sign({ userId });
    return { token };
  }

  async validate(payload: IJwtPayload): Promise<IUser> {
    return this.userService.findOneById(payload.userId);
  }
}
