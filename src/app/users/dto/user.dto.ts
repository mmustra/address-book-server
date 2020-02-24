import { IsEmail, IsString } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Role } from '../../roles/enums';
import { IUser } from '../interfaces';

export class UserDto implements Partial<IUser> {
  @ApiProperty({ example: '5e31842390a66803049ec841' })
  @IsString()
  readonly id: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsEmail()
  readonly email: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsString()
  readonly firstName: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString()
  readonly lastName: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  readonly fullName: string;

  @ApiPropertyOptional({ enum: Role, isArray: true })
  @IsString({
    each: true,
  })
  readonly roles: Role[];

  @ApiPropertyOptional({
    example:
      'https://s.gravatar.com/avatar/47cf75e67b7c68d437ec0dc9067a81f7?s=128',
  })
  @IsString()
  readonly avatarUrl: string;

  @ApiPropertyOptional()
  @IsString()
  readonly readonly: boolean;

  @ApiPropertyOptional({ example: 33 })
  readonly contactsCount: number;

  @ApiProperty({ example: '2020-01-01T00:00:01.000Z' })
  readonly createdAt: string;

  @ApiProperty({ example: '2020-01-01T00:00:01.000Z' })
  readonly updatedAt: string;
}
