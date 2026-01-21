import { Module } from '@nestjs/common';
import { ProductService } from './products/product.service';
import { ProductController } from './products/product.controller';
import { TenantProvisioningService } from './tenancy/tenancy.service';
import { TenantModule } from './tenancy/tenancy.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenancy/tenancy.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME || 'intellisales_master',
      // Only include Master entities here (Tenant)
      entities: [Tenant],
      synchronize: true,
    }),

    TenantModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, TenantProvisioningService],
})
export class AppModule {}