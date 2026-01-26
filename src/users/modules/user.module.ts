import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '../../shared/modules/shared.module';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { UserService } from '../services/user.service';
import { RoleService } from '../services/role.service';
import { PermissionService } from '../services/permission.service';
import { PermissionSeederService } from '../services/permission-seeder.service';
import { UserController } from '../controllers/user.controller';
import { RoleController } from '../controllers/role.controller';
import { PermissionController } from '../controllers/permission.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'changeme',
      signOptions: { expiresIn: '1d' },
    }),
    SharedModule,
  ], // Add JwtModule for guards
  providers: [UserService, RoleService, PermissionService, PermissionSeederService],
  controllers: [UserController, RoleController, PermissionController],
  exports: [UserService, RoleService, PermissionService, PermissionSeederService],
})
export class UserModule {}