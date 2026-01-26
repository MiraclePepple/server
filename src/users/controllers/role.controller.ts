import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiBody, ApiOperation } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Create New Role', description: 'Create a new role with specific permissions for user access control' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: 201, description: 'Role created successfully.' })
  async createRole(@Body() createRoleDto: CreateRoleDto, @Req() req) {
    return this.roleService.createRole(req.tenantDbName, createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'List All Roles', description: 'Retrieve all roles with their associated permissions' })
  @ApiResponse({ status: 200, description: 'List all roles with permissions.' })
  async getAllRoles(@Req() req) {
    return this.roleService.getAllRoles(req.tenantDbName);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Role Details', description: 'Retrieve detailed information about a specific role and its permissions' })
  @ApiResponse({ status: 200, description: 'Get role by ID with permissions.' })
  async getRoleById(@Param('id') id: string, @Req() req) {
    return this.roleService.getRoleById(req.tenantDbName, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Role', description: 'Modify role name, description, or associated permissions' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({ status: 200, description: 'Role updated successfully.' })
  async updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @Req() req) {
    return this.roleService.updateRole(req.tenantDbName, id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Role', description: 'Remove a role from the system (users with this role will lose associated permissions)' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully.' })
  async deleteRole(@Param('id') id: string, @Req() req) {
    await this.roleService.deleteRole(req.tenantDbName, id);
    return { message: 'Role deleted successfully' };
  }
}