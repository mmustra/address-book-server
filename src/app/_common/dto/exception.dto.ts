import { IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ExceptionDto {
  @ApiProperty({ example: '/path?qString=1&qString=2' })
  @IsString()
  readonly path: string;

  @ApiProperty({ example: '2020-01-01T00:00:01.000Z' })
  @IsString()
  readonly timestamp: string;

  @ApiProperty({ example: 403 })
  @IsNumber()
  readonly statusCode: number;

  @ApiProperty({ example: 'FORBIDDEN' })
  @IsString()
  readonly statusType: string;

  @ApiProperty({ example: 'Forbidden resource' })
  @IsString()
  readonly message: string;
}
