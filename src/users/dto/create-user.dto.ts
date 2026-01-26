import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsArray, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ 
    example: 'sarah.cashier', 
    description: 'Unique username (often firstname.lastname or firstname.role)' 
  })
  @IsString()
  username: string;

  @ApiProperty({ 
    example: 'sarah@yourstore.com', 
    description: 'Business email address for this employee' 
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'SecurePass123!', 
    description: 'Strong password (minimum 6 chars, use letters, numbers, symbols)' 
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ 
    example: 'Sarah Wilson',
    description: 'Employee full name' 
  })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiPropertyOptional({ 
    example: '+1-555-234-5678',
    description: 'Employee phone number' 
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ 
    type: [String], 
    example: ['cashier'], 
    description: 'Roles: ["cashier"] for POS access, ["manager"] for admin, ["cashier","manager"] for both' 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roleNames?: string[];
}
