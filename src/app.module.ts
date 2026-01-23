import { Module } from '@nestjs/common';
import { TenantProvisioningService } from './tenant/services/tenancy.service';
import { TenantModule } from './tenant/modules/tenancy.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenant/entities/tenancy.entity';
import { SystemAdmin } from './admin/entities/system-admin.entity';
import { ProductModule } from './products/modules/product.module';
import { AuthModule } from './auth/modules/auth.module';
import { UserModule } from './users/modules/user.module';
import { AdminModule } from './admin/modules/admin.module';
// Swagger setup is handled in src/swagger.ts and initialized in main.ts

@Module({
  imports: [
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
    AdminModule
  ],
  controllers: [], // Remove ProductController - it's provided by ProductModule
  providers: [TenantProvisioningService], // Remove ProductService - it's provided by ProductModule
})
export class AppModule {
  // No constructor logic here; app bootstrap handled in main.ts
}