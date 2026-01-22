import { DataSource } from 'typeorm';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { Role } from '../users/role.entity';

export function createTenantDataSource(dbName: string) {
  return new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: dbName,
    entities: [Product, User, Role], //more tenant entities here
    migrations: [__dirname + '/../migrations/tenant/*.ts'],
    synchronize: true,
  });
  
}
