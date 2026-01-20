import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.headers['x-tenant-db'];
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID header missing');
    }
    request.tenantId = tenantId;
    return true;
  }
}

