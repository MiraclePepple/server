import { Injectable } from '@nestjs/common';
import { getTenantConnection } from '../../database/tenant-connection.manager';
import { Permission } from '../entities/permission.entity';

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

    // Define all permissions based on the documentation
    const permissions = [
      // USER MANAGEMENT
      { name: 'manage_users', description: 'Create, edit, delete users', module: 'USER_MANAGEMENT' },
      { name: 'manage_roles', description: 'Create, edit, delete roles', module: 'USER_MANAGEMENT' },
      { name: 'view_staff_reports', description: 'View staff performance reports', module: 'USER_MANAGEMENT' },
      { name: 'manage_shifts', description: 'Manage staff shifts and sessions', module: 'USER_MANAGEMENT' },
      { name: 'clock_in_out', description: 'Clock in/out functionality', module: 'USER_MANAGEMENT' },
      { name: 'cash_reconciliation', description: 'Perform cash reconciliation', module: 'USER_MANAGEMENT' },

      // STOCK ENTRY
      { name: 'create_products', description: 'Create new products', module: 'STOCK_ENTRY' },
      { name: 'edit_products', description: 'Edit existing products', module: 'STOCK_ENTRY' },
      { name: 'delete_products', description: 'Delete products', module: 'STOCK_ENTRY' },
      { name: 'import_products', description: 'Import products via Excel', module: 'STOCK_ENTRY' },
      { name: 'generate_barcodes', description: 'Generate product barcodes', module: 'STOCK_ENTRY' },

      // POINT OF SALES
      { name: 'create_sales', description: 'Process sales transactions', module: 'POS' },
      { name: 'process_payments', description: 'Handle payments', module: 'POS' },
      { name: 'apply_discounts', description: 'Apply discounts and promotions', module: 'POS' },
      { name: 'handle_returns', description: 'Process returns and refunds', module: 'POS' },
      { name: 'print_receipts', description: 'Print receipts', module: 'POS' },
      { name: 'email_receipts', description: 'Email receipts to customers', module: 'POS' },
      { name: 'add_customers_at_pos', description: 'Add customers during POS transaction', module: 'POS' },
      { name: 'price_override', description: 'Override product prices', module: 'POS' },
      { name: 'end_of_day_reports', description: 'Generate end-of-day reports', module: 'POS' },

      // INVENTORY MANAGEMENT
      { name: 'view_inventory', description: 'View inventory levels', module: 'INVENTORY' },
      { name: 'adjust_stock', description: 'Adjust stock levels', module: 'INVENTORY' },
      { name: 'transfer_stock', description: 'Transfer stock between locations', module: 'INVENTORY' },
      { name: 'reset_inventory', description: 'Reset inventory to zero', module: 'INVENTORY' },
      { name: 'manage_warehouses', description: 'Manage warehouses and stores', module: 'INVENTORY' },

      // PURCHASE MANAGEMENT
      { name: 'create_purchase_orders', description: 'Create purchase orders', module: 'PURCHASE' },
      { name: 'manage_suppliers', description: 'Manage supplier information', module: 'PURCHASE' },
      { name: 'receive_inventory', description: 'Receive and update inventory', module: 'PURCHASE' },
      { name: 'view_purchase_reports', description: 'View purchase reports', module: 'PURCHASE' },

      // CUSTOMER MANAGEMENT
      { name: 'create_customers', description: 'Create new customers', module: 'CUSTOMER' },
      { name: 'edit_customers', description: 'Edit customer information', module: 'CUSTOMER' },
      { name: 'view_customer_history', description: 'View customer purchase history', module: 'CUSTOMER' },
      { name: 'manage_loyalty_programs', description: 'Manage loyalty programs', module: 'CUSTOMER' },
      { name: 'set_credit_limits', description: 'Set customer credit limits', module: 'CUSTOMER' },

      // REPORTING
      { name: 'view_sales_reports', description: 'View sales reports', module: 'REPORTING' },
      { name: 'view_inventory_reports', description: 'View inventory reports', module: 'REPORTING' },
      { name: 'view_financial_reports', description: 'View financial reports', module: 'REPORTING' },
      { name: 'access_analytics', description: 'Access analytics dashboard', module: 'REPORTING' },
      { name: 'view_user_activity_logs', description: 'View user activity logs', module: 'REPORTING' },

      // SYSTEM SETTINGS
      { name: 'manage_company_settings', description: 'Manage company settings', module: 'SYSTEM' },
      { name: 'manage_printer_settings', description: 'Manage printer settings', module: 'SYSTEM' },
      { name: 'manage_currency_settings', description: 'Manage currency settings', module: 'SYSTEM' },
      { name: 'database_recovery', description: 'Database backup and recovery', module: 'SYSTEM' },
      { name: 'manage_branches', description: 'Manage multiple branches', module: 'SYSTEM' }
    ];

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