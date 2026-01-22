import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemAdmin } from './system-admin.entity';
import { SystemAdminController } from './system-admin.controller';
import { SystemAdminService } from './system-admin.service';
import { TenantModule } from '../tenancy/tenancy.module';

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