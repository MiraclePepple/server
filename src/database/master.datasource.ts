import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Tenant } from '../tenancy/tenancy.entity';

export const MasterDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME || 'intellisales_master',
  entities: [Tenant],
  synchronize: false,
  migrations: [__dirname + '/../migrations/master/*.ts'],
});
