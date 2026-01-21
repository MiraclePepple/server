import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '../tenancy/tenancy.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Module } from '@nestjs/common/decorators/modules/module.decorator';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
