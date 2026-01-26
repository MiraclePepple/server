import { Module, Global } from '@nestjs/common';
import { TenantCacheService } from '../services/tenant-cache.service';
import { RedisService } from '../services/redis.service';

@Global() // Make this module global so we don't need to import it everywhere
@Module({
  providers: [TenantCacheService, RedisService],
  exports: [TenantCacheService, RedisService],
})
export class SharedModule {}