import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@example.com', description: 'Username or email.' })
  @IsString()
  usernameOrEmail: string;

  @ApiProperty({ example: 'P@ssw0rd!', description: 'User password.' })
  @IsString()
  password: string;
}
