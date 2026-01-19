import { Module } from '@nestjs/common';
import { ProductService } from './products/product.service';
import { ProductController } from './products/product.controller';
import { TenantProvisioningService } from './tenant-provisioning/tenant-provisioning.service';
import { TenantModule } from './tenants/tenant.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME || 'intellisales_master',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),

    TenantModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, TenantProvisioningService],
})
export class AppModule {}
