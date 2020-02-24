import { IsString } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IUser } from '../interfaces';

export class UserSimpleDto implements Partial<IUser> {
  @ApiProperty({ example: '5e31842390a66803049ec841' })
  @IsString()
  readonly id: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsString()
  readonly firstName: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString()
  readonly lastName: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  readonly fullName: string;
}
