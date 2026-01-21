import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getTenantConnection } from '../database/tenant-connection.manager';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Tenant } from '../tenancy/tenancy.entity';

@Injectable()
export class ProductService {
  // constructor(
  //   @InjectRepository(Tenant)
  //   private readonly tenantRepo: Repository<Tenant>,
  // ) {}

  async findAll(tenantDbName: string): Promise<Product[]> {
    const dataSource = await getTenantConnection(tenantDbName);
    const productRepo = dataSource.getRepository(Product);
    return productRepo.find();
  }

  async createProduct(tenantDbName: string, data: CreateProductDto) {
    const dataSource = await getTenantConnection(tenantDbName);
    const productRepo = dataSource.getRepository(Product);

    const product = productRepo.create(data);
    return productRepo.save(product);
  }

  async findById(tenantDbName: string, productId: string): Promise<Product | null> {
    const dataSource = await getTenantConnection(tenantDbName);
    const productRepo = dataSource.getRepository(Product);
    return productRepo.findOneBy({ product_id: productId });
  }
}