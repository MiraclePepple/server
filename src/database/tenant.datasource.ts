import { DataSource } from 'typeorm';
import { Product } from '../products/product.entity';

export function createTenantDataSource(dbName: string) {
  return new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: dbName,
    entities: [Product], //more tenant entities here
    migrations: [__dirname + '/../migrations/tenant/*.ts'],
    synchronize: true,
  });
  
}
