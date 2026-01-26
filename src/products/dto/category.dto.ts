import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Beverages', description: 'Category name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'All kinds of drinks' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Beverages' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'All kinds of drinks' })
  @IsOptional()
  @IsString()
  description?: string;
}
