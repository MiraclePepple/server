import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({ example: 'My Business', description: 'The name of the business.' })
  @IsString()
  businessName: string;

  @ApiProperty({ example: 'business@example.com', description: 'The email address of the business.' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'USD', description: 'The currency used by the business.' })
  @IsString()
  currency: string;

  @ApiProperty({ example: '+1234567890', description: 'The phone number of the business.' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 'securepassword', description: 'The password for the tenant admin.' })
  @IsString()
  @MinLength(6)
  password: string;
}