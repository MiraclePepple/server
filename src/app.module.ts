import { Module } from '@nestjs/common';
import { ProductService } from './products/product.service';
import { ProductController } from './products/product.controller';
import { TenantProvisioningService } from './tenancy/tenancy.service';
import { TenantModule } from './tenancy/tenancy.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantController } from './tenancy/tenancy.controller';

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
  controllers: [ProductController, TenantController],
  providers: [ProductService, TenantProvisioningService, TenantController],
})
export class AppModule {}
