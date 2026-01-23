import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Tenant } from '../../tenant/entities/tenancy.entity';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from '../services/product.service';
import { Module } from '@nestjs/common/decorators/modules/module.decorator';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'changeme',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
