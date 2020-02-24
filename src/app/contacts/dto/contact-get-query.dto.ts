import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { IContactPaginationOptions } from '../interfaces';

export class ContactGetQueryDto implements IContactPaginationOptions {
  @ApiPropertyOptional({ example: 2, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly page: number;

  @ApiPropertyOptional({ example: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly limit: number;

  @ApiPropertyOptional({ example: 'John', default: '' })
  @IsOptional()
  @IsString()
  readonly textSearch: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Transform(
    (value: string) => {
      const booleanString = value.trim().toLowerCase();
      return booleanString === 'true' ? true : false;
    },
    { toClassOnly: true },
  )
  @IsBoolean()
  readonly any: boolean;
}
