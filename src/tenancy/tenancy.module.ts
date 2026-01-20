import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenancy.entity';
import { TenantController } from './tenancy.controller';
import { TenantService } from './tenancy.service';
import { TenantProvisioningService } from './tenancy.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  controllers: [TenantController],
  providers: [TenantService, TenantProvisioningService],
  exports: [TenantService],
})
export class TenantModule {}
