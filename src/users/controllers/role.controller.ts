import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtTenantGuard } from '../../auth/guards/jwt-tenant.guard';
import { RoleService } from '../services/role.service';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';

@ApiTags('Roles')
@ApiBearerAuth('JWT-auth')
@Controller('roles')
@UseGuards(JwtTenantGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: 201, description: 'Role created successfully.' })
  async createRole(@Body() createRoleDto: CreateRoleDto, @Req() req) {
    return this.roleService.createRole(req.tenantDbName, createRoleDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List all roles with permissions.' })
  async getAllRoles(@Req() req) {
    return this.roleService.getAllRoles(req.tenantDbName);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get role by ID with permissions.' })
  async getRoleById(@Param('id') id: string, @Req() req) {
    return this.roleService.getRoleById(req.tenantDbName, id);
  }

  @Put(':id')
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({ status: 200, description: 'Role updated successfully.' })
  async updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @Req() req) {
    return this.roleService.updateRole(req.tenantDbName, id, updateRoleDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Role deleted successfully.' })
  async deleteRole(@Param('id') id: string, @Req() req) {
    await this.roleService.deleteRole(req.tenantDbName, id);
    return { message: 'Role deleted successfully' };
  }
}