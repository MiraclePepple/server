import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

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
      const payload = this.jwtService.verify(token);
      
      // Check if this is a tenant user (not system admin)
      if (payload.type !== 'tenant-user' || !payload.tenantDbName) {
        throw new UnauthorizedException('Tenant context required');
      }

      // Inject tenant info into request from JWT
      request.user = payload;
      request.tenantId = payload.tenantId;
      request.tenantDbName = payload.tenantDbName;
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired JWT token');
    }
  }
}