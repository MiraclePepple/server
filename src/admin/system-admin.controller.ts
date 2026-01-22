import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { SystemAdminGuard } from '../guards/system-admin.guard';
import { TenantService } from '../tenancy/tenancy.service';
import { CreateTenantDto } from '../tenancy/dto/create-tenant.dto';
import { SystemAdminService } from './system-admin.service';

@ApiTags('System Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(SystemAdminGuard)
export class SystemAdminController {
  constructor(
    private readonly tenantService: TenantService,
    private readonly systemAdminService: SystemAdminService,
  ) {}

  @Get('tenants')
  @ApiResponse({ status: 200, description: 'List all tenants (System Admin only).' })
  getAllTenants() {
    return this.tenantService.getAllTenants();
  }

  @Get('tenants/:id')
  @ApiResponse({ status: 200, description: 'Get tenant details (System Admin only).' })
  getTenant(@Param('id') id: string) {
    return this.tenantService.getTenantById(id);
  }

  @Delete('tenants/:id')
  @ApiResponse({ status: 200, description: 'Delete tenant (System Admin only).' })
  deleteTenant(@Param('id') id: string) {
    // Implementation for tenant deletion
    return { message: 'Tenant deletion not implemented yet' };
  }

  @Get('system-admins')
  @ApiResponse({ status: 200, description: 'List all system administrators.' })
  getAllSystemAdmins() {
    return this.systemAdminService.findAll();
  }
}