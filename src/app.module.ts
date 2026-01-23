import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TenantProvisioningService } from './tenant/services/tenancy.service';
import { TenantCacheService } from './shared/services/tenant-cache.service';
import { RedisService } from './shared/services/redis.service';
import { TenantModule } from './tenant/modules/tenancy.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenant/entities/tenancy.entity';
import { SystemAdmin } from './admin/entities/system-admin.entity';
import { ProductModule } from './products/modules/product.module';
import { AuthModule } from './auth/modules/auth.module';
import { UserModule } from './users/modules/user.module';
import { AdminModule } from './admin/modules/admin.module';
import { DomainTenantMiddleware } from './shared/middleware/domain-tenant.middleware';
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
  providers: [TenantProvisioningService, TenantCacheService, RedisService], // Add Redis and cache services
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DomainTenantMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}