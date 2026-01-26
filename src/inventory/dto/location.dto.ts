import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { LocationType } from '../entities/location.entity';

export class CreateLocationDto {
  @ApiProperty({ example: 'Main Store', description: 'Location name' })
  @IsString()
  name: string;

  @ApiProperty({ 
    enum: LocationType, 
    example: LocationType.STORE,
    description: 'Type of location - store or warehouse'
  })
  @IsEnum(LocationType)
  type: LocationType;

  @ApiPropertyOptional({ example: '123 Main Street, City, State' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateLocationDto {
  @ApiPropertyOptional({ example: 'Updated Store Name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ enum: LocationType })
  @IsOptional()
  @IsEnum(LocationType)
  type?: LocationType;

  @ApiPropertyOptional({ example: '456 Updated Street' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '+0987654321' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}