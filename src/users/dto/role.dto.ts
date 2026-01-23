import { IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'cashier', description: 'Role name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Cashier role with basic POS permissions', description: 'Role description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    example: ['create_sales', 'process_payments', 'print_receipts'], 
    description: 'Array of permission names to assign to this role',
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  permissionNames: string[];
}

export class UpdateRoleDto {
  @ApiProperty({ example: 'senior-cashier', description: 'Role name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Senior cashier with additional permissions', description: 'Role description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    example: ['create_sales', 'process_payments', 'print_receipts', 'apply_discounts'], 
    description: 'Array of permission names to assign to this role',
    type: [String],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionNames?: string[];
}