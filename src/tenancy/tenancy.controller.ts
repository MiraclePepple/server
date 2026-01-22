import { Body, Controller, NotFoundException, Param, Post, Get } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { TenantService } from './tenancy.service';
import { CreateTenantDto } from './dto/create-tenant.dto'; // Assuming DTOs are defined

@ApiTags('Tenants')
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post('create-tenant')
  @ApiBody({ type: CreateTenantDto })
  @ApiResponse({ status: 201, description: 'Tenant successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async createTenant(@Body() tenantData: CreateTenantDto) {
    return this.tenantService.createTenant(tenantData);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Tenant details retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Tenant not found.' })
  async getTenant(@Param('id') id: string) {
    const tenant = await this.tenantService.getTenantById(id);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return tenant;
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of all tenants retrieved successfully.' })
  async getAllTenants() {
    return this.tenantService.getAllTenants();
  }
}
