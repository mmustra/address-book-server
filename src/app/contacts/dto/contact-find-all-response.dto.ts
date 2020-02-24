import { IsNumber } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { IContact } from '../interfaces';
import { IContactPaginationResponse } from '../interfaces/contact-pagination-response.interface';
import { ContactDto } from './contact.dto';

export class ContactFindAllResponseDto implements IContactPaginationResponse {
  @ApiProperty({ type: ContactDto, isArray: true })
  readonly docs: IContact[];

  @ApiProperty({ example: 290 })
  @IsNumber()
  readonly totalDocs: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  readonly limit: number;

  @ApiProperty({ example: 29 })
  @IsNumber()
  readonly totalPages: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  readonly page: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  readonly pagingCounter: number;

  @ApiProperty({ example: true })
  @IsNumber()
  readonly hasPrevPage: boolean | null;

  @ApiProperty({ example: null })
  @IsNumber()
  readonly hasNextPage: boolean | null;

  @ApiProperty({ example: null })
  @IsNumber()
  readonly prevPage: number | null;

  @ApiProperty({ example: 2 })
  @IsNumber()
  readonly nextPage: number | null;
}
