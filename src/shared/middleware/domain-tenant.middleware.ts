import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantCacheService } from '../services/tenant-cache.service';

// Extend Request interface to include tenant data
declare global {
  namespace Express {
    interface Request {
      tenantFromDomain?: {
        tenant_id: string;
        business_name: string;
        db_name: string;
        domain: string;
        email: string;
      };
    }
  }
}

@Injectable()
export class DomainTenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantCacheService: TenantCacheService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const host = req.get('host') || req.hostname;
      
      // Skip domain detection for localhost and system routes
      if (this.isSystemHost(host)) {
        return next();
      }

      // Try to get tenant from domain
      const tenant = await this.tenantCacheService.getTenantByDomain(host);
      
      if (tenant) {
        req.tenantFromDomain = tenant;
        // Add a header so we know tenant was auto-detected
        res.setHeader('X-Tenant-Auto-Detected', 'true');
        res.setHeader('X-Tenant-Name', tenant.business_name);
      }
    } catch (error) {
      // Don't block the request if domain detection fails
      console.error('Domain tenant detection error:', error);
    }

    next();
  }

  private isSystemHost(host: string): boolean {
    const systemHosts = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0'
    ];

    return systemHosts.some(systemHost => host.includes(systemHost));
  }
}