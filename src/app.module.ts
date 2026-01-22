import { Module } from '@nestjs/common';
import { ProductService } from './products/product.service';
import { ProductController } from './products/product.controller';
import { TenantProvisioningService } from './tenancy/tenancy.service';
import { TenantModule } from './tenancy/tenancy.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenancy/tenancy.entity';
import { SystemAdmin } from './admin/system-admin.entity';
import { ProductModule } from './products/product.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { AdminModule } from './admin/admin.module';
import { SetupModule } from './setup/setup.module';
import { SharedJwtModule } from './shared/shared-jwt.module';
// Swagger setup is handled in src/swagger.ts and initialized in main.ts

@Module({
  imports: [
    SharedJwtModule, // Global JWT module
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME || 'intellisales_master',
      // Only include Master entities here (Tenant, SystemAdmin)
      entities: [Tenant, SystemAdmin],
      synchronize: true,
    }),

    TenantModule, 
    ProductModule,
    AuthModule,
    UserModule,
    AdminModule,
    SetupModule
  ],
  controllers: [ProductController],
  providers: [ProductService, TenantProvisioningService],
})
export class AppModule {
  // No constructor logic here; app bootstrap handled in main.ts
}