import { IsOptional, IsString } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IContactDocument } from '../interfaces/contact-document.interface';

export class ContactCreateDto implements Partial<IContactDocument> {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsOptional()
  readonly firstName: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString()
  @IsOptional()
  readonly lastName: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  readonly fullName: string;

  @ApiPropertyOptional({ example: ['user@example.com'] })
  @IsString({ each: true })
  @IsOptional()
  readonly emails: string[];

  @ApiPropertyOptional({ example: ['202-164-7996'] })
  @IsString({ each: true })
  @IsOptional()
  readonly phones: string[];

  @ApiPropertyOptional({
    example:
      'https://s.gravatar.com/avatar/47cf75e67b7c68d437ec0dc9067a81f7?s=128',
  })
  @IsString()
  @IsOptional()
  readonly avatarUrl: string;

  @ApiPropertyOptional({ example: 'This is my cousin form mother side.' })
  @IsString()
  @IsOptional()
  readonly notes: string;
}
