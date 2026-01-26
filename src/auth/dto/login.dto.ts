import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    example: 'john.doe@company.com', 
    description: 'Your email address or username registered with your company',
    required: true,
    type: 'string'
  })
  @IsString()
  usernameOrEmail: string;

  @ApiProperty({ 
    example: 'MyStrongP@ssw0rd!', 
    description: 'Your account password',
    required: true,
    type: 'string',
    format: 'password',
    minLength: 6
  })
  @IsString()
  password: string;
}
