import { ConfigService } from 'nestjs-config';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { IJwtPayload } from './interfaces';
import { AuthService } from './services';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth').jwtSecret,
    });
  }

  async validate(payload: IJwtPayload): Promise<any> {
    let user: any;

    try {
      user = await this.authService.validate(payload);
    } catch (error) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
