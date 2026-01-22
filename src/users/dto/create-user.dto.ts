import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsArray, IsUUID, MinLength } from 'class-validator';

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

  @ApiPropertyOptional({ type: [String], example: ['a1b2c3d4-e5f6-7890-1234-56789abcdef0'] })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  roleIds?: string[];
}
