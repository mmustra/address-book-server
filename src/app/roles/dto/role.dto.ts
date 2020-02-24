import { IsOptional, IsString } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IRoleDocument } from '../interfaces';

export class RoleDto implements Partial<IRoleDocument> {
  @ApiProperty({ example: '5e31842390a66803049ec841' })
  @IsString()
  readonly id: string;

  @ApiProperty({ example: 'admin' })
  @IsString()
  readonly name: string;

  @ApiPropertyOptional({ example: 'This is top level role.' })
  @IsString()
  @IsOptional()
  readonly description: string;

  @ApiProperty({ example: '2020-01-01T00:00:01.000Z' })
  readonly createdAt: string;

  @ApiProperty({ example: '2020-01-01T00:00:01.000Z' })
  readonly updatedAt: string;
}
