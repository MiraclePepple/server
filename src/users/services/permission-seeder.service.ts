import { Injectable } from '@nestjs/common';
import { getTenantConnection } from '../../database/tenant-connection.manager';
import { Permission, PERMISSION_DEFINITIONS } from '../entities/permission.entity';

@Injectable()
export class PermissionSeederService {
  async seedPermissions(tenantDbName: string): Promise<Permission[]> {
    const dataSource = await getTenantConnection(tenantDbName);
    const permissionRepo = dataSource.getRepository(Permission);

    const permissions: Permission[] = [];

    // Create all predefined permissions
    for (const [key, permissionDef] of Object.entries(PERMISSION_DEFINITIONS)) {
      const existingPermission = await permissionRepo.findOne({
        where: { name: permissionDef.name }
      });

      if (!existingPermission) {
        const permission = permissionRepo.create(permissionDef);
        const savedPermission = await permissionRepo.save(permission);
        permissions.push(savedPermission);
      } else {
        permissions.push(existingPermission);
      }
    }

    return permissions;
  }

  async getPermissionsByModule(tenantDbName: string, module: string): Promise<Permission[]> {
    const dataSource = await getTenantConnection(tenantDbName);
    const permissionRepo = dataSource.getRepository(Permission);

    return await permissionRepo.find({
      where: { module: module.toUpperCase() },
      order: { action: 'ASC', name: 'ASC' }
    });
  }

  async getAllPermissions(tenantDbName: string): Promise<Permission[]> {
    const dataSource = await getTenantConnection(tenantDbName);
    const permissionRepo = dataSource.getRepository(Permission);

    return await permissionRepo.find({
      order: { module: 'ASC', action: 'ASC', name: 'ASC' }
    });
  }

  async getPermissionsByNames(tenantDbName: string, permissionNames: string[]): Promise<Permission[]> {
    const dataSource = await getTenantConnection(tenantDbName);
    const permissionRepo = dataSource.getRepository(Permission);

    return await permissionRepo.find({
      where: permissionNames.map(name => ({ name }))
    });
  }

  // Helper method to create common role permission sets
  async getAdminPermissions(tenantDbName: string): Promise<string[]> {
    // Return all permission names for admin role
    return Object.values(PERMISSION_DEFINITIONS).map(p => p.name);
  }

  async getManagerPermissions(tenantDbName: string): Promise<string[]> {
    // Manager permissions: Most operations except system admin functions
    return Object.values(PERMISSION_DEFINITIONS)
      .filter(p => !p.module.includes('SYSTEM') && p.action !== 'DELETE')
      .map(p => p.name);
  }

  async getCashierPermissions(tenantDbName: string): Promise<string[]> {
    // Cashier permissions: POS operations, customer basic operations, product reading
    const cashierModules = ['POS', 'CUSTOMERS', 'PRODUCTS', 'INVENTORY'];
    const allowedActions = ['CREATE', 'READ', 'UPDATE'];
    
    return Object.values(PERMISSION_DEFINITIONS)
      .filter(p => 
        cashierModules.includes(p.module) && 
        (allowedActions.includes(p.action) || p.name.includes('pos:'))
      )
      .map(p => p.name);
  }

  async getInventoryPermissions(tenantDbName: string): Promise<string[]> {
    // Inventory staff permissions: Full inventory management, product reading
    const inventoryModules = ['INVENTORY', 'PRODUCTS', 'LOCATIONS', 'PURCHASES'];
    
    return Object.values(PERMISSION_DEFINITIONS)
      .filter(p => inventoryModules.includes(p.module))
      .map(p => p.name);
  }
}