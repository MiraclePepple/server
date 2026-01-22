import { Injectable } from '@nestjs/common';
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

    // Create database using master connection
    await MasterDataSource.query(`CREATE DATABASE "${tenantName}"`);

    // Create tenant DataSource and initialize
    const tenantDataSource = createTenantDataSource(tenantName);
    await tenantDataSource.initialize();

    // Run migrations for tenant DB schema
    await tenantDataSource.runMigrations();

    return dbName;
  }
}

@Injectable()
export class TenantService {
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
  }) {
    // 1. Save tenant in MASTER database (without db_name first)
    const tenant = await this.tenantRepo.save({
      business_name: data.businessName,
      email: data.email,
      currency: data.currency,
      phone_number: data.phoneNumber,
    });
    const tenantDbName = `${slugifyTenantName(data.businessName)}_${tenant.tenant_id.slice(0, 6)}`;

    // 2. Provision tenant DB (create DB, run migrations)
    await this.tenantProvisioningService.provisionTenant(tenantDbName);

    // Create first admin user in tenant DB
    const tenantDataSource = createTenantDataSource(tenantDbName);
    await tenantDataSource.initialize();
    const userRepo = tenantDataSource.getRepository(require('../users/user.entity').User);
    const roleRepo = tenantDataSource.getRepository(require('../users/role.entity').Role);
    let adminRole = await roleRepo.findOne({ where: { name: 'admin' } });
    if (!adminRole) {
      adminRole = roleRepo.create({ name: 'admin', description: 'Tenant Administrator' });
      await roleRepo.save(adminRole);
    }
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(data.password || 'changeme', 10);
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

    // 3. Update tenant with the database name
    tenant.db_name = tenantDbName;
    await this.tenantRepo.save(tenant);

    // 4. Return tenant credentials (db name, etc.)
    return {
      tenantId: tenant.tenant_id,
      dbName: tenant.db_name,
      email: tenant.email,
      businessName: tenant.business_name,
      currency: tenant.currency,
      phoneNumber: tenant.phone_number,
      // Add more credentials if needed
    };
  }

  async getTenantById(tenantId: string): Promise<Tenant | null> {
    const tenantRepo = MasterDataSource.getRepository(Tenant);
    return tenantRepo.findOneBy({ tenant_id: tenantId });
  }

  async getAllTenants(): Promise<Tenant[]> {
    return this.tenantRepo.find();
  }
}