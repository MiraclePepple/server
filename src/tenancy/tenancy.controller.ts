import { Body, Controller, NotFoundException, Param, Post, Get } from '@nestjs/common';
import { TenantService } from './tenancy.service';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post('create-tenant')
  async createTenant(@Body() tenantData: { businessName: string; email: string; currency: string; phoneNumber: string }) {
    return this.tenantService.createTenant(tenantData);
  }

  @Get(':id')
  async getTenant(@Param('id') id: string) {
    const tenant = await this.tenantService.getTenantById(id);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return tenant;
  }

  @Get()
  async getAllTenants() {
    return this.tenantService.getAllTenants();
  }
  
}
