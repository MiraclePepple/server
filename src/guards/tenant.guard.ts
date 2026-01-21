import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { MasterDataSource } from '../database/master.datasource';
import { Tenant } from '../tenancy/tenancy.entity';

@Injectable()
export class TenantGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenantDbName = request.headers['x-tenant-db'] || request.headers['x-tenant-id']; //this holds the db name string

    if (!tenantDbName) {
      throw new UnauthorizedException('Tenant ID header missing');
    }

    const tenantRepo = MasterDataSource.getRepository(Tenant);
    const tenant = await tenantRepo.findOneBy({ db_name: tenantDbName }); //look up by db_name

    if (!tenant) {
      throw new UnauthorizedException('Invalid tenant');
    }

    request.tenant = tenant;
    request.tenantDbName = tenant.db_name;

    return true;
  }
}

