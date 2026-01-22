import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MasterDataSource } from '../database/master.datasource';
import { Tenant } from './tenancy.entity';
import { createTenantDataSource } from '../database/tenant.datasource';
import { slugifyTenantName } from '../utils/slugify';

@Injectable()
export class TenantProvisioningService {
  async provisionTenant(dbName: string) {
    const tenantName = `tenant_${dbName}`;

    try {
      // Create database using master connection
      await MasterDataSource.query(`CREATE DATABASE "${tenantName}"`);
      Logger.log(`Database created: ${tenantName}`, 'TenantProvisioningService');

      // Add a short delay to ensure the database is ready
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create tenant DataSource and initialize
      const tenantDataSource = createTenantDataSource(tenantName);
      await tenantDataSource.initialize();
      Logger.log(`Tenant DataSource initialized: ${tenantName}`, 'TenantProvisioningService');

      // Run migrations for tenant DB schema
      await tenantDataSource.runMigrations();
      Logger.log(`Migrations executed for database: ${tenantName}`, 'TenantProvisioningService');

      return dbName;
    } catch (error) {
      Logger.error(`Error during database provisioning: ${error.message}`, error.stack, 'TenantProvisioningService');
      throw error;
    }
  }
}

@Injectable()
export class TenantService {
  private readonly logger = new Logger(TenantService.name);

  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
    private readonly tenantProvisioningService: TenantProvisioningService,
  ) {}

  async createTenant(data: {
    businessName: string;
    email: string;
    currency: string;
    phoneNumber: string;
    password: string;
  }) {
    try {
      this.logger.log('Starting tenant creation process');

      // Check if tenant with this email already exists
      const existingTenant = await this.tenantRepo.findOne({ where: { email: data.email } });
      if (existingTenant) {
        throw new Error(`Tenant with email ${data.email} already exists`);
      }

      // Generate db_name before saving the tenant
      const tenantDbName = `${slugifyTenantName(data.businessName)}_${Math.random().toString(36).substring(2, 8)}`;

      // 1. Save tenant in MASTER database with db_name
      const tenant = await this.tenantRepo.save({
        business_name: data.businessName,
        email: data.email,
        currency: data.currency,
        phone_number: data.phoneNumber,
        db_name: tenantDbName, // Assign db_name here
      });
      this.logger.log(`Tenant saved in master DB: ${tenant.tenant_id}`);

      // 2. Provision tenant DB (create DB, run migrations)
      await this.tenantProvisioningService.provisionTenant(tenantDbName);
      this.logger.log(`Tenant database provisioned: ${tenantDbName}`);

      const tenantName = `tenant_${tenantDbName}`;

      // Create first admin user in tenant DB
      const tenantDataSource = createTenantDataSource(tenantName);
      await tenantDataSource.initialize();
      this.logger.log('Tenant data source initialized');

      const userRepo = tenantDataSource.getRepository(require('../users/user.entity').User);
      const roleRepo = tenantDataSource.getRepository(require('../users/role.entity').Role);

      let adminRole = await roleRepo.findOne({ where: { name: 'admin' } });
      if (!adminRole) {
        adminRole = roleRepo.create({ name: 'admin', description: 'Tenant Administrator' });
        await roleRepo.save(adminRole);
      }
      this.logger.log('Admin role ensured');

      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const adminUser = userRepo.create({
        username: data.email,
        email: data.email,
        password: hashedPassword,
        full_name: data.businessName,
        phone: data.phoneNumber,
        is_active: true,
        roles: [adminRole],
      });
      await userRepo.save(adminUser);
      this.logger.log('Admin user created');

      // 3. Return tenant credentials (db name, etc.)
      return {
        tenantId: tenant.tenant_id,
        dbName: tenant.db_name,
        email: tenant.email,
        businessName: tenant.business_name,
        currency: tenant.currency,
        phoneNumber: tenant.phone_number,
      };
    } catch (error) {
      this.logger.error('Error during tenant creation', error.stack);
      throw error;
    }
  }

  async getTenantById(tenantId: string): Promise<Tenant | null> {
    const tenantRepo = MasterDataSource.getRepository(Tenant);
    return tenantRepo.findOneBy({ tenant_id: tenantId });
  }

  async getAllTenants(): Promise<Tenant[]> {
    return this.tenantRepo.find();
  }
}