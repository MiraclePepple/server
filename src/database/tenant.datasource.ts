import { DataSource } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.entity';
import { Permission } from '../users/entities/permission.entity';

export function createTenantDataSource(dbName: string) {
  return new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: dbName,
    entities: [Product, User, Role, Permission], //more tenant entities here
    migrations: [__dirname + '/../migrations/tenant/*.ts'],
    synchronize: true,
  });
  
}
