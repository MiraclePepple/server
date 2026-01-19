import { Injectable } from '@nestjs/common';
import { getTenantConnection } from '../database/tenant-connection.manager';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  async findAll(tenantId: string): Promise<Product[]> {
    const dataSource = await getTenantConnection(tenantId);
    const productRepo = dataSource.getRepository(Product);
    return productRepo.find();
  }
}
