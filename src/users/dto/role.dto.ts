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
    example: ['pos:create_sale', 'pos:read_sales', 'customers:create', 'customers:read', 'products:read'], 
    description: 'Array of actual permission names from your system (use GET /permissions to see all available)',
    type: [String],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionNames?: string[];
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
    example: ['pos:create_sale', 'pos:read_sales', 'pos:discount', 'customers:create', 'customers:read', 'products:read', 'inventory:read'], 
    description: 'Array of actual permission names from your system (use GET /permissions to see all available)',
    type: [String],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionNames?: string[];
}
