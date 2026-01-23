import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DomainLoginDto {
  @ApiProperty({ 
    description: 'Username or email address',
    example: 'john@company.com' 
  })
  @IsString()
  usernameOrEmail: string;

  @ApiProperty({ 
    description: 'User password',
    example: 'strongPassword123' 
  })
  @IsString()
  password: string;
}