import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { MasterDataSource } from '../database/master.datasource';
import { Tenant } from '../tenant/entities/tenancy.entity';
import { TenantCacheService } from '../shared/services/tenant-cache.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly tenantCacheService: TenantCacheService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    let tenant: Tenant | null = null;

    // Method 1: Try to get tenant from domain (auto-detected in middleware)
    if (request.tenantFromDomain) {
      tenant = request.tenantFromDomain;
    }
    
    // Method 2: Fallback to header-based detection
    if (!tenant) {
      const tenantDbName = request.headers['x-tenant-db'] || request.headers['x-tenant-id'];
      
      if (tenantDbName) {
        // Try cache first, then database
        tenant = await this.tenantCacheService.getTenantByDbName(tenantDbName);
        
        if (!tenant) {
          // Fallback to direct database query
          const tenantRepo = MasterDataSource.getRepository(Tenant);
          tenant = await tenantRepo.findOneBy({ db_name: tenantDbName });
        }
      }
    }

    // Method 3: Try to extract from host header if no tenant found yet
    if (!tenant) {
      const host = request.get('host') || request.hostname;
      if (host && !this.isSystemHost(host)) {
        tenant = await this.tenantCacheService.getTenantByDomain(host);
      }
    }

    if (!tenant) {
      throw new UnauthorizedException('Tenant not found. Please ensure you are accessing the correct domain or provide tenant headers.');
    }

    // Set tenant context on request
    request.tenant = tenant;
    request.tenantDbName = tenant.db_name;
    request.tenantId = tenant.tenant_id;

    return true;
  }

  private isSystemHost(host: string): boolean {
    const systemHosts = ['localhost', '127.0.0.1', '0.0.0.0'];
    return systemHosts.some(systemHost => host.includes(systemHost));
  }
}

