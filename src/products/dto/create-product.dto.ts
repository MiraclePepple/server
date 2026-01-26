import { IsString, IsNumber, IsOptional, IsNotEmpty, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ProductType {
  SIMPLE = 'simple',
  COMPOSITE = 'composite',
  INVENTORY = 'inventory',
  SERVICE = 'service',
}

export class CreateProductDto {
  @ApiProperty({ 
    example: 'Organic Coffee Beans 1kg', 
    description: 'Product name that customers will see' 
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ 
    example: 'Premium quality coffee beans from Colombian highlands', 
    description: 'Detailed product description for customers' 
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ 
    example: 'COF-ORG-1KG',
    description: 'Stock Keeping Unit - your internal product code' 
  })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({ 
    example: '012345678905',
    description: 'Product barcode (leave empty for auto-generation)' 
  })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiProperty({ 
    enum: ProductType, 
    example: ProductType.SIMPLE,
    description: 'Product type: simple=regular item, service=non-inventory, composite=bundle, inventory=tracked stock'
  })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty({ 
    example: 24.99,
    description: 'Retail selling price (what customers pay)'
  })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: 10, description: 'Low stock alert threshold' })
  @IsNumber()
  @IsOptional()
  low_stock_threshold?: number;

  @ApiPropertyOptional({ example: '2024-12-31', description: 'Product expiry date (YYYY-MM-DD)' })
  @IsOptional()
  expiry_date?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  is_composite?: boolean;

  @ApiPropertyOptional({ example: 'https://example.com/images/coffee-beans.jpg' })
  @IsString()
  @IsOptional()
  image_url?: string;

  @ApiPropertyOptional({ example: 'uuid-category-id', description: 'Category ID to assign product to' })
  @IsUUID()
  @IsOptional()
  category_id?: string;
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

  @ApiPropertyOptional({ example: 5, description: 'Update low stock threshold' })
  @IsNumber()
  @IsOptional()
  low_stock_threshold?: number;

  @ApiPropertyOptional({ example: '2024-12-31', description: 'Update expiry date (YYYY-MM-DD)' })
  @IsOptional()
  expiry_date?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  is_composite?: boolean;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  image_url?: string;

  @ApiPropertyOptional({ example: 'uuid-category-id', description: 'Category ID to assign product to' })
  @IsUUID()
  @IsOptional()
  category_id?: string;
}
