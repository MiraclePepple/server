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
    // Save tenant in MASTER database (without db_name first)
    const tenant = await this.tenantRepo.save({
      business_name: data.businessName,
      email: data.email,
      currency: data.currency,
      phone_number: data.phoneNumber,
    });
    const tenantDbName = `${slugifyTenantName(data.businessName)}_${tenant.tenant_id.slice(0, 6)}`;

    // Update tenant with the database name
    tenant.db_name = tenantDbName;
    await this.tenantRepo.save(tenant);

    return tenant;

    // Create tenant database at RUNTIME
    //const tenantDbName = `${slugifyTenantName(data.businessName)}_${tenant.tenant_id.slice(0, 6)}`;

    await this.tenantProvisioningService.provisionTenant(tenantDbName);
  }

  async getTenantById(tenantId: string): Promise<Tenant | null> {
    const tenantRepo = MasterDataSource.getRepository(Tenant);
    return tenantRepo.findOneBy({ tenant_id: tenantId });
  }

  async getAllTenants(): Promise<Tenant[]> {
    return this.tenantRepo.find();
  }
}