import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ExceptionDto } from '../_common/dto';
import { UserCredentialsDto, UserRegisterDto } from '../users/dto';
import { TokenDto } from './dto';
import { IToken } from './interfaces';
import { AuthService } from './services';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({
    status: 201,
    type: TokenDto,
  })
  @ApiResponse({
    status: 400,
    type: ExceptionDto,
  })
  async registerUser(@Body() registerData: UserRegisterDto): Promise<IToken> {
    return this.authService.register(registerData);
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiResponse({
    status: 201,
    type: TokenDto,
  })
  @ApiResponse({
    status: 400,
    type: ExceptionDto,
  })
  async loginUser(@Body() credentials: UserCredentialsDto): Promise<IToken> {
    return this.authService.login(credentials);
  }
}
