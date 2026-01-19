import { Body, Controller, Post } from '@nestjs/common';
import { TenantService } from './tenant.service';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post('create-tenant')
  async createTenant(@Body() tenantData: { businessName: string; email: string; currency: string; phoneNumber: string }) {
    return this.tenantService.createTenant(tenantData);
  }
}
