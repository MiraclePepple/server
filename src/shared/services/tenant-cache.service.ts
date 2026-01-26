import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from './redis.service';
import { MasterDataSource } from '../../database/master.datasource';
import { Tenant } from '../../tenant/entities/tenancy.entity';

interface TenantCacheData {
  tenant_id: string;
  business_name: string;
  db_name: string;
  domain: string;
  email: string;
  phone_number: string;
  logo: string;
  currency: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

@Injectable()
export class TenantCacheService {
  private readonly logger = new Logger(TenantCacheService.name);
  private readonly CACHE_TTL = 3600; // 1 hour

  constructor(private readonly redisService: RedisService) {}

  private getTenantCacheKey(identifier: string): string {
    return `tenant:${identifier}`;
  }

  private getDomainCacheKey(domain: string): string {
    return `tenant:domain:${domain}`;
  }

  async getTenantByIdentifier(identifier: string): Promise<Tenant | null> {
    // Try Redis cache first
    const cacheKey = this.getTenantCacheKey(identifier);
    let tenant = await this.redisService.get<Tenant>(cacheKey);
    
    if (tenant) {
      this.logger.debug(`Cache HIT for tenant: ${identifier}`);
      return tenant;
    }

    this.logger.debug(`Cache MISS for tenant: ${identifier}, querying database`);
    // Fallback to database
    tenant = await this.fetchTenantFromDatabase(identifier);
    
    // Cache the result
    if (tenant) {
      await this.redisService.set(cacheKey, tenant, this.CACHE_TTL);
      // Also cache by domain if domain exists
      if (tenant.domain) {
        await this.redisService.set(this.getDomainCacheKey(tenant.domain), tenant, this.CACHE_TTL);
      }
    }
    
    return tenant;
  }

  // Extract subdomain from full domain
  private extractSubdomain(domain: string): string {
    // Handle localhost for development (use first tenant as fallback)
    if (domain === 'localhost' || domain.startsWith('localhost:')) {
      return 'localhost';
    }
    
    // e.g., "company1.intellisales.com" → "company1"
    // e.g., "acme-corp.yourdomain.com" → "acme-corp"
    const parts = domain.split('.');
    return parts[0];
  }

  async getTenantByDomain(domain: string): Promise<Tenant | null> {
    // Handle localhost development case - get the first available tenant
    if (domain === 'localhost' || domain.startsWith('localhost:')) {
      this.logger.debug(`Development mode: localhost access, finding first tenant`);
      return this.getFirstAvailableTenant();
    }

    // Extract subdomain (e.g., "company1" from "company1.intellisales.com")
    const subdomain = this.extractSubdomain(domain);
    
    // Try Redis cache first
    const domainCacheKey = this.getDomainCacheKey(subdomain);
    let tenant = await this.redisService.get<Tenant>(domainCacheKey);
    
    if (tenant) {
      this.logger.debug(`Cache HIT for domain: ${domain}`);
      return tenant;
    }

    this.logger.debug(`Cache MISS for domain: ${domain}, querying database`);
    // Fallback to database
    tenant = await this.fetchTenantByDomainFromDatabase(subdomain);
    
    // Cache the result
    if (tenant) {
      await this.redisService.set(domainCacheKey, tenant, this.CACHE_TTL);
      // Also cache by identifier
      await this.redisService.set(this.getTenantCacheKey(tenant.email), tenant, this.CACHE_TTL);
    }
    
    return tenant;
  }

  // Get tenant by db_name
  async getTenantByDbName(dbName: string): Promise<Tenant | null> {
    return this.getTenantByIdentifier(dbName);
  }

  private async fetchTenantFromDatabase(identifier: string): Promise<Tenant | null> {
    try {
      const tenantRepo = MasterDataSource.getRepository(Tenant);
      const tenant = await tenantRepo.findOne({
        where: [
          { email: identifier },
          { business_name: identifier },
          { db_name: identifier },
          { domain: identifier }
        ]
      });
      
      return tenant;
    } catch (error) {
      this.logger.error('Database query error:', error);
      return null;
    }
  }

  private async fetchTenantByDomainFromDatabase(domain: string): Promise<Tenant | null> {
    try {
      const tenantRepo = MasterDataSource.getRepository(Tenant);
      const tenant = await tenantRepo.findOne({
        where: { domain }
      });
      
      return tenant;
    } catch (error) {
      this.logger.error('Database query error:', error);
      return null;
    }
  }

  private async getFirstAvailableTenant(): Promise<Tenant | null> {
    try {
      const tenantRepo = MasterDataSource.getRepository(Tenant);
      const tenant = await tenantRepo.findOne({
        order: { created_at: 'ASC' } // Get the first created tenant
      });
      
      if (tenant) {
        this.logger.debug(`Found first tenant for localhost: ${tenant.business_name}`);
        // Cache it for future requests
        await this.cacheTenant(tenant);
      }
      
      return tenant;
    } catch (error) {
      this.logger.error('Error fetching first tenant for localhost:', error);
      return null;
    }
  }

  async cacheTenant(tenant: Tenant): Promise<void> {
    // Cache by email/identifier
    await this.redisService.set(this.getTenantCacheKey(tenant.email), tenant, this.CACHE_TTL);
    // Cache by domain if exists
    if (tenant.domain) {
      await this.redisService.set(this.getDomainCacheKey(tenant.domain), tenant, this.CACHE_TTL);
    }
  }

  async invalidateTenant(tenantId: string): Promise<void> {
    // Invalidate all tenant-related cache entries
    await this.redisService.invalidatePattern(`tenant:*${tenantId}*`);
    await this.redisService.invalidatePattern(`user:${tenantId}:*`);
    await this.redisService.invalidatePattern(`role:${tenantId}:*`);
  }
}