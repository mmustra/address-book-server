import { IsString } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { UserSimpleDto } from '../../users/dto';
import { IContact } from '../interfaces';

export class ContactDto implements IContact {
  @ApiProperty({ example: '5e31842390a66803049ec841' })
  @IsString()
  readonly id: string;

  @ApiProperty({ example: '390a66803049ec8415e31842' })
  @IsString()
  readonly userId: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsString()
  readonly firstName: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString()
  readonly lastName: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  readonly fullName: string;

  @ApiPropertyOptional({ example: ['user@example.com'] })
  @IsString()
  readonly emails: string[];

  @ApiPropertyOptional({ example: ['202-164-7996'] })
  @IsString()
  readonly phones: string[];

  @ApiPropertyOptional({
    example:
      'https://s.gravatar.com/avatar/47cf75e67b7c68d437ec0dc9067a81f7?s=128',
  })
  @IsString()
  readonly avatarUrl: string;

  @ApiPropertyOptional({ example: 'This is my cousin form mother side.' })
  readonly notes: string;

  @ApiProperty()
  readonly user: UserSimpleDto;

  @ApiProperty({ example: '2020-01-01T00:00:01.000Z' })
  readonly createdAt: string;

  @ApiProperty({ example: '2020-01-01T00:00:01.000Z' })
  readonly updatedAt: string;
}
