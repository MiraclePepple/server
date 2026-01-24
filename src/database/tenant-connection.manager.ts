import { DataSource } from 'typeorm';
import { createTenantDataSource } from './tenant.datasource';

const tenantConnections = new Map<string, DataSource>();

export async function getTenantConnection(dbName: string): Promise<DataSource> {
  if (!dbName) {
    throw new Error('dbName is undefined – tenant resolution failed');
  }

  console.log('Input dbName:', dbName);
  
  // The dbName already includes the tenant_ prefix from provisioning
  const fullDbName = dbName.startsWith('tenant_') ? dbName : `tenant_${dbName}`;
  
  console.log('Full database name:', fullDbName);
  
  if (tenantConnections.has(fullDbName)) {
    console.log('Using cached connection for:', fullDbName);
    return tenantConnections.get(fullDbName)!;
  }

  console.log('Creating new connection to:', fullDbName);
  const dataSource = createTenantDataSource(fullDbName);
  await dataSource.initialize();
  tenantConnections.set(fullDbName, dataSource);
  return dataSource;
}