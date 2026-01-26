import { Injectable, NotFoundException } from '@nestjs/common';
import { getTenantConnection } from '../../database/tenant-connection.manager';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';

@Injectable()
export class RoleService {
  async createRole(tenantDbName: string, createRoleDto: CreateRoleDto): Promise<Role> {
    const tenantConnection = await getTenantConnection(tenantDbName);
    const roleRepo = tenantConnection.getRepository(Role);
    const permissionRepo = tenantConnection.getRepository(Permission);

    let permissions: Permission[] = [];
    
    // Find permissions by names if provided
    if (createRoleDto.permissionNames && createRoleDto.permissionNames.length > 0) {
      permissions = await permissionRepo.find({
        where: createRoleDto.permissionNames.map(name => ({ name }))
      });
    }

    const role = roleRepo.create({
      name: createRoleDto.name,
      description: createRoleDto.description,
      permissions
    });

    return roleRepo.save(role);
  }

  async getAllRoles(tenantDbName: string): Promise<Role[]> {
    const tenantConnection = await getTenantConnection(tenantDbName);
    const roleRepo = tenantConnection.getRepository(Role);
    return roleRepo.find({
      relations: ['permissions'],
      order: { name: 'ASC' }
    });
  }

  async getRoleById(tenantDbName: string, roleId: string): Promise<Role> {
    const tenantConnection = await getTenantConnection(tenantDbName);
    const roleRepo = tenantConnection.getRepository(Role);
    const role = await roleRepo.findOne({
      where: { role_id: roleId },
      relations: ['permissions']
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async getRoleByName(tenantDbName: string, roleName: string): Promise<Role> {
    const tenantConnection = await getTenantConnection(tenantDbName);
    const roleRepo = tenantConnection.getRepository(Role);
    const role = await roleRepo.findOne({
      where: { name: roleName },
      relations: ['permissions']
    });

    if (!role) {
      throw new NotFoundException(`Role '${roleName}' not found`);
    }

    return role;
  }

  async updateRole(tenantDbName: string, roleId: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const tenantConnection = await getTenantConnection(tenantDbName);
    const roleRepo = tenantConnection.getRepository(Role);
    const permissionRepo = tenantConnection.getRepository(Permission);

    const role = await this.getRoleById(tenantDbName, roleId);

    if (updateRoleDto.name) {
      role.name = updateRoleDto.name;
    }

    if (updateRoleDto.description !== undefined) {
      role.description = updateRoleDto.description;
    }

    if (updateRoleDto.permissionNames) {
      const permissions = await permissionRepo.find({
        where: updateRoleDto.permissionNames.map(name => ({ name }))
      });
      role.permissions = permissions;
    }

    return roleRepo.save(role);
  }

  async deleteRole(tenantDbName: string, roleId: string): Promise<void> {
    const tenantConnection = await getTenantConnection(tenantDbName);
    const roleRepo = tenantConnection.getRepository(Role);
    
    const role = await this.getRoleById(tenantDbName, roleId);
    await roleRepo.remove(role);
  }
}