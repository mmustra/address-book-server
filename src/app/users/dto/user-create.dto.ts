import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Role } from '../../roles/enums';

export class UserCreateDto {
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
