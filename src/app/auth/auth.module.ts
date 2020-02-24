import { ConfigService } from 'nestjs-config';

import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import * as service from './services/auth.service';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { jwtSecret, tokenExpiresIn } = configService.get('auth');

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: tokenExpiresIn,
          },
        };
      },
    }),
    UsersModule,
  ],
  providers: [...Object.values(service), JwtStrategy],
  exports: [PassportModule, service.AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
