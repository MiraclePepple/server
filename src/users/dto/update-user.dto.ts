import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsArray, MinLength, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'jdoe' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ example: 'jdoe@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'NewStr0ngP@ss!' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiPropertyOptional({ example: '+15555550123' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({ 
    type: [String], 
    example: ['manager', 'cashier'], 
    description: 'Array of role names to assign to the user' 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roleNames?: string[];
}
