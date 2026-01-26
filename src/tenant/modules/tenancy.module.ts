import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../../shared/modules/shared.module';
import { Tenant } from '../entities/tenancy.entity';
import { TenantController } from '../controllers/tenancy.controller';
import { TenantService } from '../services/tenancy.service';
import { TenantProvisioningService } from '../services/tenancy.service';
import { UserModule } from '../../users/modules/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant]),
    UserModule, // Import UserModule to access PermissionService
    SharedModule
  ],
  controllers: [TenantController],
  providers: [TenantService, TenantProvisioningService],
  exports: [TenantService],
})
export class TenantModule {}
