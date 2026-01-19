import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';
import { TenantProvisioningService } from '../tenant-provisioning/tenant-provisioning.service';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
    private readonly tenantProvisioningService: TenantProvisioningService,
  ) {}

  async createTenant(data: {
    businessName: string;
    email: string;
    currency: string;
    phoneNumber: string;
  }) {
    //Save tenant in MASTER database
    const tenant = await this.tenantRepo.save({
      business_name: data.businessName,
      email: data.email,
      currency: data.currency,
      phone_number: data.phoneNumber,
    });

    //Create tenant database at RUNTIME
    await this.tenantProvisioningService.provisionTenant(
      tenant.tenant_id,
    );

    return tenant;
  }
}
