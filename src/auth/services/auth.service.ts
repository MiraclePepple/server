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

  async validateUser(usernameOrEmail: string, password: string) {
    // This is for SYSTEM ADMIN login - uses master database
    const admin = await this.systemAdminService.findByUsernameOrEmail(usernameOrEmail);

    if (admin && await bcrypt.compare(password, admin.password)) {
      const { password, ...result } = admin;
      return {
        ...result,
        isSystemAdmin: true,
      };
    }
    return null;
  }

  async login(user: any) {
    // System admin login - no tenant context
    const payload = { 
      sub: user.user_id || user.admin_id, 
      username: user.username, 
      isSystemAdmin: true,
      type: 'system-admin'
    };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async validateTenantUser(tenantIdentifier: string, usernameOrEmail: string, password: string) {
    // Find tenant by code/email/domain
    let tenant: Tenant | null = null;
    
    // Try cache first
    tenant = await this.tenantCacheService.getTenantByDbName(tenantIdentifier);
    
    if (!tenant) {
      // Try to find by domain
      tenant = await this.tenantCacheService.getTenantByDomain(tenantIdentifier);
    }
    
    if (!tenant) {
      // Fallback to database search
      const tenantRepo = MasterDataSource.getRepository(Tenant);
      tenant = await tenantRepo.findOne({ where: [
        { db_name: tenantIdentifier },
        { email: tenantIdentifier },
        { business_name: tenantIdentifier },
        { domain: tenantIdentifier },
      ] });
    }
    
    if (!tenant) throw new UnauthorizedException('Tenant not found');
    
    // Connect to tenant DB
    const tenantDataSource = createTenantDataSource(`tenant_${tenant.db_name}`);
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
      return {
        ...result,
        user_id: user.user_id,
        username: user.username,
        roles: user.roles,
        tenantId: tenant.tenant_id,
        dbName: tenant.db_name,
        tenantDomain: tenant.domain,
      };
    }
    return null;
  }

  // New method: Domain-based login (no tenant identifier required)
  async domainLogin(domain: string, usernameOrEmail: string, password: string) {
    // Get tenant from domain (with caching)
    const tenant = await this.tenantCacheService.getTenantByDomain(domain);
    if (!tenant) throw new UnauthorizedException('Invalid domain or tenant not found');
    
    // Use existing validateTenantUser logic with the found tenant
    const user = await this.validateTenantUser(tenant.db_name, usernameOrEmail, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    
    // JWT contains tenant information
    const payload = {
      sub: user.user_id,
      username: user.username,
      roles: user.roles?.map(r => r.name),
      tenantId: user.tenantId,
      domain: tenant.domain,
      type: 'tenant-user'
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        ...user,
        tenant: {
          id: user.tenantId,
          business_name: tenant.business_name,
          domain: tenant.domain,
        }
      },
    };
  }

  async tenantLogin(tenantIdentifier: string, usernameOrEmail: string, password: string) {
    const user = await this.validateTenantUser(tenantIdentifier, usernameOrEmail, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    
    // JWT contains tenant information - no need for headers!
    const payload = {
      sub: user.user_id,
      username: user.username,
      roles: user.roles?.map(r => r.name),
      tenantId: user.tenantId, // Use tenant ID instead of database name for security
      type: 'tenant-user'
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        ...user,
        tenant: {
          id: user.tenantId,
          identifier: tenantIdentifier // Return identifier, not database name
        }
      },
    };
  }
}
