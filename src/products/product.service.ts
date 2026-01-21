import { Injectable } from '@nestjs/common';
import { getTenantConnection } from '../database/tenant-connection.manager';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  async findAll(tenantName: string): Promise<Product[]> {
    const dataSource = await getTenantConnection(tenantName);
    const productRepo = dataSource.getRepository(Product);
    return productRepo.find();
  }

  async createProduct(tenantName: string, data: CreateProductDto) {
    const dataSource = await getTenantConnection(tenantName);
    const productRepo = dataSource.getRepository(Product);

    const product = productRepo.create(data);
    await productRepo.save(product);

    return product;
  }

  async findById(tenantName: string, productId: string): Promise<Product | null> {
    const dataSource = await getTenantConnection(tenantName);
    const productRepo = dataSource.getRepository(Product);
    return productRepo.findOneBy({ product_id: productId });
  }
}