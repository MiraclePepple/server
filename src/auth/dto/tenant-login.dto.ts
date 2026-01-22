import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TenantLoginDto {
  @ApiProperty({ example: 'tenant_db_abc123', description: 'Tenant identifier (db name, code, or email).' })
  @IsString()
  tenantIdentifier: string;

  @ApiProperty({ example: 'owner@example.com', description: 'Username or email within the tenant.' })
  @IsString()
  usernameOrEmail: string;

  @ApiProperty({ example: 'P@ssw0rd!', description: 'User password.' })
  @IsString()
  password: string;
}
