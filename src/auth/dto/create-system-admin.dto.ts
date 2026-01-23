import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSystemAdminDto {
  @ApiProperty({ example: 'admin', description: 'Unique username for system admin' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'admin@intellisales.com', description: 'Email address for system admin' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'securepassword123', description: 'Password for system admin (min 6 characters)' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Administrator', description: 'Full name of the system admin' })
  @IsNotEmpty()
  @IsString()
  full_name: string;
}