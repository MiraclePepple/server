import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '../entities/tenancy.entity';
import { TenantController } from '../controllers/tenancy.controller';
import { TenantService } from '../services/tenancy.service';
import { TenantProvisioningService } from '../services/tenancy.service';
import { UserModule } from '../../users/modules/user.module';
import { RedisService } from '../../shared/services/redis.service';
import { TenantCacheService } from '../../shared/services/tenant-cache.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant]),
    UserModule // Import UserModule to access PermissionService
  ],
  controllers: [TenantController],
  providers: [TenantService, TenantProvisioningService, RedisService, TenantCacheService],
  exports: [TenantService, TenantCacheService, RedisService],
})
export class TenantModule {}
