import { IsString, IsEmail, IsOptional, IsEnum, IsDateString, IsNumber, IsArray, IsBoolean, IsUUID, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  last_name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '1990-01-01', description: 'Date of birth' })
  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @ApiPropertyOptional({ example: 'male', enum: ['male', 'female', 'other'] })
  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  gender?: string;

  @ApiPropertyOptional({ example: '123 Main St, Apt 4B', description: 'Address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'New York', description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'NY', description: 'State' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: '10001', description: 'Postal code' })
  @IsOptional()
  @IsString()
  postal_code?: string;

  @ApiPropertyOptional({ example: 'USA', description: 'Country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 'VIP customer, prefers email communication' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: { communication_preference: 'email', marketing_opt_in: true } })
  @IsOptional()
  preferences?: any;

  @ApiPropertyOptional({ example: ['VIP', 'corporate', 'frequent_buyer'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateCustomerDto {
  @ApiPropertyOptional({ example: 'John', description: 'First name' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  first_name?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'Last name' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  last_name?: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com', description: 'Email address' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '1990-01-01', description: 'Date of birth' })
  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @ApiPropertyOptional({ example: 'male', enum: ['male', 'female', 'other'] })
  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  gender?: string;

  @ApiPropertyOptional({ example: '123 Main St, Apt 4B', description: 'Address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'New York', description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'NY', description: 'State' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: '10001', description: 'Postal code' })
  @IsOptional()
  @IsString()
  postal_code?: string;

  @ApiPropertyOptional({ example: 'USA', description: 'Country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 'active', enum: ['active', 'inactive', 'blocked'] })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'blocked'])
  status?: string;

  @ApiPropertyOptional({ example: 'VIP customer, prefers email communication' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: { communication_preference: 'email', marketing_opt_in: true } })
  @IsOptional()
  preferences?: any;

  @ApiPropertyOptional({ example: ['VIP', 'corporate', 'frequent_buyer'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class CustomerQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Items per page' })
  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'john', description: 'Search by name or email' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'active', enum: ['active', 'inactive', 'blocked'] })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'blocked'])
  status?: string;

  @ApiPropertyOptional({ example: 'gold', enum: ['bronze', 'silver', 'gold', 'platinum'] })
  @IsOptional()
  @IsEnum(['bronze', 'silver', 'gold', 'platinum'])
  loyalty_tier?: string;

  @ApiPropertyOptional({ example: 'New York', description: 'Filter by city' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'NY', description: 'Filter by state' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: 'VIP', description: 'Filter by tag' })
  @IsOptional()
  @IsString()
  tag?: string;
}

export class CreateCustomerAddressDto {
  @ApiProperty({ example: 'home', enum: ['home', 'work', 'billing', 'shipping', 'other'] })
  @IsEnum(['home', 'work', 'billing', 'shipping', 'other'])
  address_type: string;

  @ApiProperty({ example: 'Home Address', description: 'Address label' })
  @IsString()
  label: string;

  @ApiProperty({ example: '123 Main St', description: 'Address line 1' })
  @IsString()
  address_line_1: string;

  @ApiPropertyOptional({ example: 'Apt 4B', description: 'Address line 2' })
  @IsOptional()
  @IsString()
  address_line_2?: string;

  @ApiProperty({ example: 'New York', description: 'City' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'NY', description: 'State' })
  @IsString()
  state: string;

  @ApiProperty({ example: '10001', description: 'Postal code' })
  @IsString()
  postal_code: string;

  @ApiProperty({ example: 'USA', description: 'Country' })
  @IsString()
  country: string;

  @ApiPropertyOptional({ example: true, description: 'Set as default address' })
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}

export class UpdateCustomerAddressDto {
  @ApiPropertyOptional({ example: 'home', enum: ['home', 'work', 'billing', 'shipping', 'other'] })
  @IsOptional()
  @IsEnum(['home', 'work', 'billing', 'shipping', 'other'])
  address_type?: string;

  @ApiPropertyOptional({ example: 'Home Address', description: 'Address label' })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiPropertyOptional({ example: '123 Main St', description: 'Address line 1' })
  @IsOptional()
  @IsString()
  address_line_1?: string;

  @ApiPropertyOptional({ example: 'Apt 4B', description: 'Address line 2' })
  @IsOptional()
  @IsString()
  address_line_2?: string;

  @ApiPropertyOptional({ example: 'New York', description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'NY', description: 'State' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: '10001', description: 'Postal code' })
  @IsOptional()
  @IsString()
  postal_code?: string;

  @ApiPropertyOptional({ example: 'USA', description: 'Country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: true, description: 'Set as default address' })
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}