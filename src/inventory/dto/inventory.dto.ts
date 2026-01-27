import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class StockAdjustmentDto {
  @ApiProperty({ example: 'uuid-product-id', description: 'Product ID' })
  @IsUUID()
  product_id: string;

  @ApiProperty({ example: 'uuid-location-id', description: 'Location ID' })
  @IsUUID()
  location_id: string;

  @ApiProperty({ example: 100, description: 'New stock quantity' })
  @IsNumber()
  @Min(0)
  new_quantity: number;

  @ApiPropertyOptional({ example: 'Stock count adjustment' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ example: 'Physical count revealed discrepancy' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class StockTransferDto {
  @ApiProperty({ example: 'uuid-product-id', description: 'Product ID' })
  @IsUUID()
  product_id: string;

  @ApiProperty({ example: 'uuid-from-location-id', description: 'Source location ID' })
  @IsUUID()
  from_location_id: string;

  @ApiProperty({ example: 'uuid-to-location-id', description: 'Destination location ID' })
  @IsUUID()
  to_location_id: string;

  @ApiProperty({ example: 10, description: 'Quantity to transfer' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({ example: 'Restocking main store from warehouse' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class InventoryQueryDto {
  @ApiPropertyOptional({ example: 'uuid-product-id', description: 'Filter by product ID' })
  @IsOptional()
  @IsString()
  product_id?: string;

  @ApiPropertyOptional({ example: 'uuid-location-id', description: 'Filter by location ID' })
  @IsOptional()
  @IsString()
  location_id?: string;

  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'apple', description: 'Search term for product name or SKU' })
  @IsOptional()
  @IsString()
  search?: string;
}