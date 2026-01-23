import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '../entities/tenancy.entity';
import { TenantController } from '../controllers/tenancy.controller';
import { TenantService } from '../services/tenancy.service';
import { TenantProvisioningService } from '../services/tenancy.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  controllers: [TenantController],
  providers: [TenantService, TenantProvisioningService],
  exports: [TenantService],
})
export class TenantModule {}
