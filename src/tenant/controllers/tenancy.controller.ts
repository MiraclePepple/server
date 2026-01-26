import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { TenantService } from '../services/tenancy.service';
import { CreateTenantDto } from '../dto/create-tenant.dto';

@ApiTags('Public - Business Registration')
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post('register')
  @ApiOperation({ 
    summary: 'Register New Business', 
    description: 'Create your business account. System will auto-generate a domain if none provided.' 
  })
  @ApiBody({ 
    type: CreateTenantDto,
    examples: {
      basicRegistration: {
        summary: 'Basic Business Registration',
        description: 'Standard registration without custom domain',
        value: {
          businessName: 'ACME Corporation',
          email: 'admin@acmecorp.com',
          currency: 'USD',
          phoneNumber: '+1-555-123-4567',
          password: 'MySecureP@ssw0rd123!'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Business successfully registered.',
    example: {
      message: 'Tenant and initial admin user created successfully.',
      tenant: {
        tenant_id: 'uuid',
        businessName: 'ACME Corporation',
        email: 'admin@acmecorp.com',
        domain: 'acme-corporation.intellisales.com',
        currency: 'USD'
      },
      user: {
        user_id: 'uuid',
        username: 'admin@acmecorp.com',
        email: 'admin@acmecorp.com',
        full_name: 'ACME Corporation'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid input data or business already exists.' })
  async registerBusiness(@Body() businessData: CreateTenantDto) {
    return this.tenantService.createTenant(businessData);
  }
}
