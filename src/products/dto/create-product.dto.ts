import { IsString, IsNumber, IsOptional, Min, IsNotEmpty, IsEnum } from 'class-validator';

export enum ProductType {
  SIMPLE = 'simple',
  COMPOSITE = 'composite',
  INVENTORY = 'inventory',
}

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsEnum(ProductType)
  type: ProductType;

  @IsNumber()
  price: number;

  @IsOptional()
  is_composite?: boolean;

  @IsString()
  @IsOptional()
  image_url?: string;
}
