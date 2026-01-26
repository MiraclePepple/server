import { Injectable } from '@nestjs/common';
import { getTenantConnection } from '../../database/tenant-connection.manager';
import { Permission, PERMISSION_DEFINITIONS } from '../entities/permission.entity';

@Injectable()
export class PermissionService {
  async createPermissionsForTenant(tenantDbName: string) {
    const tenantConnection = await getTenantConnection(tenantDbName);
    const permissionRepo = tenantConnection.getRepository(Permission);

    // Check if permissions already exist
    const existingPermissions = await permissionRepo.count();
    if (existingPermissions > 0) {
      return; // Permissions already created
    }

    // Define all permissions based on the documentation using PERMISSION_DEFINITIONS
    const permissions = Object.values(PERMISSION_DEFINITIONS);

    // Create permissions
    for (const permissionData of permissions) {
      const permission = permissionRepo.create(permissionData);
      await permissionRepo.save(permission);
    }
  }

  async getAllPermissions(tenantDbName: string): Promise<Permission[]> {
    const tenantConnection = await getTenantConnection(tenantDbName);
    const permissionRepo = tenantConnection.getRepository(Permission);
    return permissionRepo.find({
      order: { module: 'ASC', name: 'ASC' }
    });
  }

  async getPermissionsByModule(tenantDbName: string, module: string): Promise<Permission[]> {
    const tenantConnection = await getTenantConnection(tenantDbName);
    const permissionRepo = tenantConnection.getRepository(Permission);
    return permissionRepo.find({
      where: { module },
      order: { name: 'ASC' }
    });
  }
}