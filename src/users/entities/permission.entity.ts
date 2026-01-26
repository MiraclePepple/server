import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  permission_id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  module: string; // USERS, PRODUCTS, INVENTORY, CUSTOMERS, POS, REPORTS, etc.

  @Column()
  action: string; // CREATE, READ, UPDATE, DELETE, EXPORT, IMPORT

  @ManyToMany(() => Role, role => role.permissions)
  roles: Role[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

// Predefined permission constants for seeding
export const PERMISSION_DEFINITIONS = {
  // User Management
  USERS_CREATE: { name: 'users:create', description: 'Create users', module: 'USERS', action: 'CREATE' },
  USERS_READ: { name: 'users:read', description: 'View users', module: 'USERS', action: 'READ' },
  USERS_UPDATE: { name: 'users:update', description: 'Update users', module: 'USERS', action: 'UPDATE' },
  USERS_DELETE: { name: 'users:delete', description: 'Delete users', module: 'USERS', action: 'DELETE' },
  USERS_EXPORT: { name: 'users:export', description: 'Export user data', module: 'USERS', action: 'EXPORT' },

  // Role & Permission Management
  ROLES_CREATE: { name: 'roles:create', description: 'Create roles', module: 'ROLES', action: 'CREATE' },
  ROLES_READ: { name: 'roles:read', description: 'View roles', module: 'ROLES', action: 'READ' },
  ROLES_UPDATE: { name: 'roles:update', description: 'Update roles', module: 'ROLES', action: 'UPDATE' },
  ROLES_DELETE: { name: 'roles:delete', description: 'Delete roles', module: 'ROLES', action: 'DELETE' },
  PERMISSIONS_READ: { name: 'permissions:read', description: 'View permissions', module: 'PERMISSIONS', action: 'READ' },

  // Product Management
  PRODUCTS_CREATE: { name: 'products:create', description: 'Create products', module: 'PRODUCTS', action: 'CREATE' },
  PRODUCTS_READ: { name: 'products:read', description: 'View products', module: 'PRODUCTS', action: 'READ' },
  PRODUCTS_UPDATE: { name: 'products:update', description: 'Update products', module: 'PRODUCTS', action: 'UPDATE' },
  PRODUCTS_DELETE: { name: 'products:delete', description: 'Delete products', module: 'PRODUCTS', action: 'DELETE' },
  PRODUCTS_EXPORT: { name: 'products:export', description: 'Export product data', module: 'PRODUCTS', action: 'EXPORT' },
  PRODUCTS_IMPORT: { name: 'products:import', description: 'Import product data', module: 'PRODUCTS', action: 'IMPORT' },

  // Category Management
  CATEGORIES_CREATE: { name: 'categories:create', description: 'Create categories', module: 'CATEGORIES', action: 'CREATE' },
  CATEGORIES_READ: { name: 'categories:read', description: 'View categories', module: 'CATEGORIES', action: 'READ' },
  CATEGORIES_UPDATE: { name: 'categories:update', description: 'Update categories', module: 'CATEGORIES', action: 'UPDATE' },
  CATEGORIES_DELETE: { name: 'categories:delete', description: 'Delete categories', module: 'CATEGORIES', action: 'DELETE' },

  // Inventory Management
  INVENTORY_CREATE: { name: 'inventory:create', description: 'Create inventory records', module: 'INVENTORY', action: 'CREATE' },
  INVENTORY_READ: { name: 'inventory:read', description: 'View inventory', module: 'INVENTORY', action: 'READ' },
  INVENTORY_UPDATE: { name: 'inventory:update', description: 'Update inventory', module: 'INVENTORY', action: 'UPDATE' },
  INVENTORY_DELETE: { name: 'inventory:delete', description: 'Delete inventory records', module: 'INVENTORY', action: 'DELETE' },
  INVENTORY_ADJUST: { name: 'inventory:adjust', description: 'Adjust stock levels', module: 'INVENTORY', action: 'ADJUST' },
  INVENTORY_TRANSFER: { name: 'inventory:transfer', description: 'Transfer stock between locations', module: 'INVENTORY', action: 'TRANSFER' },
  INVENTORY_EXPORT: { name: 'inventory:export', description: 'Export inventory data', module: 'INVENTORY', action: 'EXPORT' },

  // Location Management
  LOCATIONS_CREATE: { name: 'locations:create', description: 'Create locations', module: 'LOCATIONS', action: 'CREATE' },
  LOCATIONS_READ: { name: 'locations:read', description: 'View locations', module: 'LOCATIONS', action: 'READ' },
  LOCATIONS_UPDATE: { name: 'locations:update', description: 'Update locations', module: 'LOCATIONS', action: 'UPDATE' },
  LOCATIONS_DELETE: { name: 'locations:delete', description: 'Delete locations', module: 'LOCATIONS', action: 'DELETE' },

  // Customer Management
  CUSTOMERS_CREATE: { name: 'customers:create', description: 'Create customers', module: 'CUSTOMERS', action: 'CREATE' },
  CUSTOMERS_READ: { name: 'customers:read', description: 'View customers', module: 'CUSTOMERS', action: 'READ' },
  CUSTOMERS_UPDATE: { name: 'customers:update', description: 'Update customers', module: 'CUSTOMERS', action: 'UPDATE' },
  CUSTOMERS_DELETE: { name: 'customers:delete', description: 'Delete customers', module: 'CUSTOMERS', action: 'DELETE' },
  CUSTOMERS_EXPORT: { name: 'customers:export', description: 'Export customer data', module: 'CUSTOMERS', action: 'EXPORT' },
  CUSTOMERS_IMPORT: { name: 'customers:import', description: 'Import customer data', module: 'CUSTOMERS', action: 'IMPORT' },

  // POS Operations
  POS_CREATE_SALE: { name: 'pos:create_sale', description: 'Process sales transactions', module: 'POS', action: 'CREATE' },
  POS_READ_SALES: { name: 'pos:read_sales', description: 'View sales data', module: 'POS', action: 'READ' },
  POS_UPDATE_SALE: { name: 'pos:update_sale', description: 'Modify sales transactions', module: 'POS', action: 'UPDATE' },
  POS_DELETE_SALE: { name: 'pos:delete_sale', description: 'Void/delete sales', module: 'POS', action: 'DELETE' },
  POS_REFUND: { name: 'pos:refund', description: 'Process refunds', module: 'POS', action: 'REFUND' },
  POS_DISCOUNT: { name: 'pos:discount', description: 'Apply discounts', module: 'POS', action: 'DISCOUNT' },

  // Purchase Management
  PURCHASES_CREATE: { name: 'purchases:create', description: 'Create purchase orders', module: 'PURCHASES', action: 'CREATE' },
  PURCHASES_READ: { name: 'purchases:read', description: 'View purchases', module: 'PURCHASES', action: 'READ' },
  PURCHASES_UPDATE: { name: 'purchases:update', description: 'Update purchases', module: 'PURCHASES', action: 'UPDATE' },
  PURCHASES_DELETE: { name: 'purchases:delete', description: 'Delete purchases', module: 'PURCHASES', action: 'DELETE' },
  PURCHASES_APPROVE: { name: 'purchases:approve', description: 'Approve purchase orders', module: 'PURCHASES', action: 'APPROVE' },

  // Reporting & Analytics
  REPORTS_SALES: { name: 'reports:sales', description: 'View sales reports', module: 'REPORTS', action: 'READ' },
  REPORTS_INVENTORY: { name: 'reports:inventory', description: 'View inventory reports', module: 'REPORTS', action: 'READ' },
  REPORTS_CUSTOMERS: { name: 'reports:customers', description: 'View customer reports', module: 'REPORTS', action: 'READ' },
  REPORTS_FINANCIAL: { name: 'reports:financial', description: 'View financial reports', module: 'REPORTS', action: 'READ' },
  REPORTS_EXPORT: { name: 'reports:export', description: 'Export reports', module: 'REPORTS', action: 'EXPORT' },

  // System Administration
  SYSTEM_SETTINGS: { name: 'system:settings', description: 'Manage system settings', module: 'SYSTEM', action: 'UPDATE' },
  SYSTEM_BACKUP: { name: 'system:backup', description: 'Perform system backups', module: 'SYSTEM', action: 'BACKUP' },
  SYSTEM_AUDIT: { name: 'system:audit', description: 'View audit logs', module: 'SYSTEM', action: 'READ' },
};