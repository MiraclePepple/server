import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../users/services/user.service';
import { TenantService } from '../../tenant/services/tenancy.service';
import { TenantCacheService } from '../../shared/services/tenant-cache.service';
import { SystemAdminService } from '../../admin/services/system-admin.service';
import { MasterDataSource } from '../../database/master.datasource';
import { Tenant } from '../../tenant/entities/tenancy.entity';
import { createTenantDataSource } from '../../database/tenant.datasource';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tenantService: TenantService,
    private readonly tenantCacheService: TenantCacheService,
    private readonly systemAdminService: SystemAdminService,
  ) {}


  // Unified login for all users (admin, manager, cashier)
  async login(usernameOrEmail: string, password: string) {
    // Search all tenants for user by email (excluding system admin)
    const tenantRepo = MasterDataSource.getRepository(Tenant);
    const tenants = await tenantRepo.find();
    for (const tenant of tenants) {
      const tenantDataSource = createTenantDataSource(`tenant_${tenant.db_name}`);
      try {
        await tenantDataSource.initialize();
        const userRepo = tenantDataSource.getRepository(require('../../users/entities/user.entity').User);
        const user = await userRepo.findOne({
          where: [
            { username: usernameOrEmail },
            { email: usernameOrEmail },
          ],
          relations: ['roles'],
        });
        if (user && await bcrypt.compare(password, user.password)) {
          const { password, ...result } = user;
          const payload = {
            sub: user.user_id,
            username: user.username,
            roles: user.roles?.map(r => r.name),
            tenantId: tenant.tenant_id,
            domain: tenant.domain,
            type: 'tenant-user',
          };
          return {
            access_token: this.jwtService.sign(payload),
            user: {
              ...result,
              roles: user.roles,
              tenant: {
                id: tenant.tenant_id,
                business_name: tenant.business_name,
                domain: tenant.domain,
              },
            },
          };
        }
      } catch (e) {
        // Ignore tenant DBs that fail to connect
      } finally {
        if (tenantDataSource.isInitialized) await tenantDataSource.destroy();
      }
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  // Dedicated system admin login
  async adminLogin(username: string, password: string) {
    const admin = await this.systemAdminService.findByUsernameOrEmail(username);
    if (!admin || !await bcrypt.compare(password, admin.password)) {
      throw new UnauthorizedException('Invalid admin credentials');
    }
    
    const { password: _, ...result } = admin;
    const payload = {
      sub: result.admin_id,
      username: result.username,
      isSystemAdmin: true,
      type: 'system-admin',
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: { ...result, isSystemAdmin: true },
    };
  }


}
