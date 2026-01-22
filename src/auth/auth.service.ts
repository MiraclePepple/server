import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { TenantService } from '../tenancy/tenancy.service';
import { SystemAdminService } from '../admin/system-admin.service';
import { MasterDataSource } from '../database/master.datasource';
import { Tenant } from '../tenancy/tenancy.entity';
import { createTenantDataSource } from '../database/tenant.datasource';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tenantService: TenantService,
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
    // Find tenant by code/email
    const tenantRepo = MasterDataSource.getRepository(Tenant);
    const tenant = await tenantRepo.findOne({ where: [
      { db_name: tenantIdentifier },
      { email: tenantIdentifier },
      { business_name: tenantIdentifier },
    ] });
    if (!tenant) throw new UnauthorizedException('Tenant not found');
    // Connect to tenant DB
    const tenantDataSource = createTenantDataSource(`tenant_${tenant.db_name}`);
    await tenantDataSource.initialize();
    const userRepo = tenantDataSource.getRepository(require('../users/user.entity').User);
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
        user_id: user.user_id, // Ensure user_id is included
        username: user.username, // Ensure username is included
        roles: user.roles, // Ensure roles are included
        tenantId: tenant.tenant_id,
        dbName: tenant.db_name,
      };
    }
    return null;
  }

  async tenantLogin(tenantIdentifier: string, usernameOrEmail: string, password: string) {
    const user = await this.validateTenantUser(tenantIdentifier, usernameOrEmail, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    
    // JWT contains tenant information - no need for headers!
    const payload = {
      sub: user.user_id,
      username: user.username,
      roles: user.roles?.map(r => r.name),
      tenantId: user.tenantId,
      tenantDbName: user.dbName, // This is the key - tenant info in JWT
      type: 'tenant-user'
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        ...user,
        tenant: {
          id: user.tenantId,
          dbName: user.dbName
        }
      },
    };
  }
}
