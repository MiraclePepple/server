import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ 
    example: 'superadmin', 
    description: 'System administrator username (not email)',
    required: true
  })
  @IsString()
  username: string;

  @ApiProperty({ 
    example: 'AdminP@ssw0rd!', 
    description: 'System administrator password',
    required: true,
    minLength: 8
  })
  @IsString()
  password: string;
}