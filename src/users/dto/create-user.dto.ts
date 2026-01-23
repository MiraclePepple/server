import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsArray, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'jdoe', description: 'Unique username.' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'jdoe@example.com', description: 'Unique email address.' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongP@ssw0rd!', description: 'Account password.' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiPropertyOptional({ example: '+15555550123' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ 
    type: [String], 
    example: ['cashier', 'manager'], 
    description: 'Array of role names to assign to the user' 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roleNames?: string[];
}
