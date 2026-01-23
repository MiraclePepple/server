import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtTenantGuard } from '../../auth/guards/jwt-tenant.guard';
import { PermissionService } from '../services/permission.service';

@ApiTags('Permissions')
@ApiBearerAuth('JWT-auth')
@Controller('permissions')
@UseGuards(JwtTenantGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'List all permissions.' })
  async getAllPermissions(@Req() req) {
    return this.permissionService.getAllPermissions(req.tenantDbName);
  }

  @Get('module/:module')
  @ApiResponse({ status: 200, description: 'List permissions by module.' })
  async getPermissionsByModule(@Param('module') module: string, @Req() req) {
    return this.permissionService.getPermissionsByModule(req.tenantDbName, module);
  }
}