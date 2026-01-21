import { DataSource } from 'typeorm';
import { createTenantDataSource } from './tenant.datasource';

const tenantConnections = new Map<string, DataSource>();

export async function getTenantConnection(dbName: string): Promise<DataSource> {
  // Add tenant_ prefix to match the database name created during provisioning
  const fullDbName = `tenant_${dbName}`;
  
  if (tenantConnections.has(fullDbName)) {
    return tenantConnections.get(fullDbName)!;
  }

  const dataSource = createTenantDataSource(fullDbName);
  await dataSource.initialize();
  tenantConnections.set(fullDbName, dataSource);
  return dataSource;
}