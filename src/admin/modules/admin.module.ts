import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemAdmin } from '../entities/system-admin.entity';
import { SystemAdminController } from '../controllers/system-admin.controller';
import { SystemAdminService } from '../services/system-admin.service';
import { TenantModule } from '../../tenant/modules/tenancy.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SystemAdmin]),
    JwtModule, // Import JwtModule for guards
    TenantModule
  ],
  providers: [SystemAdminService],
  controllers: [SystemAdminController],
  exports: [SystemAdminService],
})
export class AdminModule {}