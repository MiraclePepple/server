import { Injectable } from '@nestjs/common';
import { MasterDataSource } from '../database/master.datasource';
import { createTenantDataSource } from '../database/tenant.datasource';

@Injectable()
export class TenantProvisioningService {
  async provisionTenant(tenantId: string) {
    const dbName = `intellisales_tenant_${tenantId}`;

    //Create database using master connection
    await MasterDataSource.query(`CREATE DATABASE "${dbName}"`);

    //Create tenant DataSource and initialize
    const tenantDataSource = createTenantDataSource(dbName);
    await tenantDataSource.initialize();

    //Run migrations for tenant DB schema
    await tenantDataSource.runMigrations();

    return dbName;
  }
}
