import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({ example: 'ACME Corporation', description: 'Your business or company name.' })
  @IsString()
  businessName: string;

  @ApiProperty({ example: 'admin@acmecorp.com', description: 'Email address for the business administrator account.' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'USD', description: 'Primary currency for your business (USD, EUR, GBP, etc.).' })
  @IsString()
  currency: string;

  @ApiProperty({ example: '+1-555-123-4567', description: 'Primary business phone number.' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 'MySecureP@ssw0rd123!', description: 'Password for the administrator account (minimum 6 characters).' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    example: undefined,
    description: 'Custom domain (optional). Leave empty for auto-generated domain based on business name.',
    required: false
  })
  @IsString()
  @IsOptional()
  domain?: string;
}