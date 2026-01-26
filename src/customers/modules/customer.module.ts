import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '../../shared/modules/shared.module';
import { Customer } from '../entities/customer.entity';
import { CustomerAddress } from '../entities/customer-address.entity';
import { CustomerController } from '../controllers/customer.controller';
import { CustomerService } from '../services/customer.service';
import { Tenant } from '../../tenant/entities/tenancy.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant, Customer, CustomerAddress]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'changeme',
      signOptions: { expiresIn: '1d' },
    }),
    SharedModule,
  ],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule {}