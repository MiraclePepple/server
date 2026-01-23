import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MasterDataSource } from '../../database/master.datasource';
import { Tenant } from '../../tenant/entities/tenancy.entity';

@Injectable()
export class JwtTenantGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('JWT token missing');
    }

    const token = authHeader.substring(7);
    
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'changeme'
      });
      
      // Check if this is a tenant user (not system admin)
      if (payload.type !== 'tenant-user' || !payload.tenantId) {
        throw new UnauthorizedException('Tenant context required');
      }

      // Resolve tenant database name from tenant ID for security
      const tenantRepo = MasterDataSource.getRepository(Tenant);
      const tenant = await tenantRepo.findOneBy({ tenant_id: payload.tenantId });
      
      if (!tenant) {
        throw new UnauthorizedException('Invalid tenant');
      }

      // Inject tenant info into request from JWT
      request.user = payload;
      request.tenantId = payload.tenantId;
      request.tenantDbName = tenant.db_name; // Resolved from database, not exposed in JWT
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired JWT token');
    }
  }
}