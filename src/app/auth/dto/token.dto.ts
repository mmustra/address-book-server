import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { IToken } from '../interfaces/token.interface';

export class TokenDto implements IToken {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIs...',
  })
  @IsString()
  readonly token: string;
}
