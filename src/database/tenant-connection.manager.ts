import { DataSource } from 'typeorm';
import { createTenantDataSource } from './tenant.datasource';

const tenantConnections = new Map<string, DataSource>();

export async function getTenantConnection(dbName: string): Promise<DataSource> {
  if (tenantConnections.has(dbName)) {
    return tenantConnections.get(dbName)!;
  }

  // Use the exact dbName, no prefix change
  const dataSource = createTenantDataSource(dbName);
  await dataSource.initialize();
  tenantConnections.set(dbName, dataSource);
  return dataSource;
}
