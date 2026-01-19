import { DataSource } from 'typeorm';
import { createTenantDataSource } from './tenant.datasource';

const tenantConnections = new Map<string, DataSource>();

export async function getTenantConnection(tenantId: string): Promise<DataSource> {
  if (tenantConnections.has(tenantId)) {
    return tenantConnections.get(tenantId)!;
  }

  const dbName = `intellisales_tenant_${tenantId}`;
  const dataSource = createTenantDataSource(dbName);
  await dataSource.initialize();
  tenantConnections.set(tenantId, dataSource);
  return dataSource;
}
