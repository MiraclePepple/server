import { IsString, IsNumber, IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ProductType {
  SIMPLE = 'simple',
  COMPOSITE = 'composite',
  INVENTORY = 'inventory',
  SERVICE = 'service',
}

export class CreateProductDto {
  @ApiProperty({ example: 'Premium Coffee Beans', description: 'Product name.' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Premium quality coffee beans from Colombia', description: 'Product description.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'COF-PRM-1KG' })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({ example: '012345678905' })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiProperty({ enum: ProductType, example: ProductType.SIMPLE })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty({ example: 29.99 })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  is_composite?: boolean;

  @ApiPropertyOptional({ example: 'https://example.com/images/coffee-beans.jpg' })
  @IsString()
  @IsOptional()
  image_url?: string;
}

// Update Product DTO - all fields optional for partial updates
export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Updated Premium Coffee Beans', description: 'Product name.' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Updated premium quality coffee beans', description: 'Product description.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'COF-PRM-1KG-UPD' })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({ example: 'UPC12345678901' })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiPropertyOptional({ example: ProductType.SIMPLE, enum: ProductType })
  @IsEnum(ProductType)
  @IsOptional()
  type?: ProductType;

  @ApiPropertyOptional({ example: 29.99 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  is_composite?: boolean;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  image_url?: string;
}
