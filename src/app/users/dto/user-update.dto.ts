import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { Role } from '../../roles/enums';

export class UserUpdateDto {
  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @ApiPropertyOptional({ example: 'pass1234' })
  @IsOptional()
  readonly password: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  readonly firstName: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  readonly lastName: string;

  @ApiPropertyOptional({ enum: Role, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(1)
  @IsString({
    each: true,
  })
  readonly roles: Role[];

  @ApiPropertyOptional({
    example:
      'https://s.gravatar.com/avatar/47cf75e67b7c68d437ec0dc9067a81f7?s=128',
  })
  @IsOptional()
  @IsString()
  readonly avatarUrl: string;
}
