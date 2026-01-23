import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { TenantService } from '../services/tenancy.service';
import { CreateTenantDto } from '../dto/create-tenant.dto';

@ApiTags('Public - Business Registration')
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post('register')
  @ApiBody({ type: CreateTenantDto })
  @ApiResponse({ status: 201, description: 'Business successfully registered and tenant created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async registerBusiness(@Body() businessData: CreateTenantDto) {
    return this.tenantService.createTenant(businessData);
  }
}
