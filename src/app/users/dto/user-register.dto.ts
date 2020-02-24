import { Equals, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Role } from '../../roles/enums';

export class UserRegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'pass1234' })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  readonly firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  readonly lastName: string;

  @ApiHideProperty()
  @IsOptional()
  @Equals(undefined)
  readonly roles: Role[];

  @ApiPropertyOptional({
    example:
      'https://s.gravatar.com/avatar/47cf75e67b7c68d437ec0dc9067a81f7?s=128',
  })
  @IsOptional()
  @IsString()
  readonly avatarUrl: string;
}
