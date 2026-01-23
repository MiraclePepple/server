import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../../users/modules/user.module';
import { TenantModule } from '../../tenant/modules/tenancy.module';
import { AdminModule } from '../../admin/modules/admin.module';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { TenantCacheService } from '../../shared/services/tenant-cache.service';
import { RedisService } from '../../shared/services/redis.service';

@Module({
  imports: [
    UserModule,
    TenantModule,
    AdminModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'changeme',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, TenantCacheService, RedisService],
  controllers: [AuthController],
  exports: [AuthService], // AuthService has JwtService injected
})
export class AuthModule {}
