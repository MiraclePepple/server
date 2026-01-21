import { DataSource } from 'typeorm';
import { createTenantDataSource } from './tenant.datasource';

const tenantConnections = new Map<string, DataSource>();

export async function getTenantConnection(dbName: string): Promise<DataSource> {
  if (!dbName) {
    throw new Error('dbName is undefined – tenant resolution failed');
  }

  console.log('Input dbName:', dbName);
  
  // Add tenant_ prefix to match the database name created during provisioning
  const fullDbName = `tenant_${dbName}`;
  
  console.log('Full database name with prefix:', fullDbName);
  
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