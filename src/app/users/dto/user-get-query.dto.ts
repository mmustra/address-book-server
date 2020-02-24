import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { IUserPaginationOptions } from '../interfaces';

export class UserGetQueryDto implements IUserPaginationOptions {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly page: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly limit: number;

  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  readonly textSearch: string;
}
