import { DataSource } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductCategory } from '../products/entities/category.entity';
import { Location } from '../inventory/entities/location.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { StockMovement } from '../inventory/entities/stock-movement.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.entity';
import { Permission } from '../users/entities/permission.entity';
import { Customer } from '../customers/entities/customer.entity';
import { CustomerAddress } from '../customers/entities/customer-address.entity';

export function createTenantDataSource(dbName: string) {
  return new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: dbName,
    entities: [
      Product, 
      ProductCategory, 
      Location, 
      Inventory, 
      StockMovement, 
      User, 
      Role, 
      Permission,
      Customer,
      CustomerAddress
    ], // All tenant entities
    migrations: [__dirname + '/../migrations/tenant/*.ts'],
    synchronize: true,
  });
}
