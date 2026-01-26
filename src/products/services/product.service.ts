import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getTenantConnection } from '../../database/tenant-connection.manager';
import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '../dto/create-product.dto';
import { Tenant } from '../../tenant/entities/tenancy.entity';

@Injectable()
export class ProductService {
  // constructor(
  //   @InjectRepository(Tenant)
  //   private readonly tenantRepo: Repository<Tenant>,
  // ) {}

  async findAll(
    tenantDbName: string,
    options?: { page?: number; limit?: number }
  ): Promise<{ items: Product[]; total: number; page: number; limit: number }> {
    const dataSource = await getTenantConnection(tenantDbName);
    const productRepo = dataSource.getRepository(Product);
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const [items, total] = await productRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });
    return { items, total, page, limit };
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

  async updateProduct(tenantDbName: string, productId: string, data: UpdateProductDto): Promise<Product | null> {
    const dataSource = await getTenantConnection(tenantDbName);
    const productRepo = dataSource.getRepository(Product);
    
    // Check if product exists
    const existingProduct = await productRepo.findOneBy({ product_id: productId });
    if (!existingProduct) {
      return null;
    }

    // Update the product
    await productRepo.update({ product_id: productId }, data);
    
    // Return updated product
    return productRepo.findOneBy({ product_id: productId });
  }

  async deleteProduct(tenantDbName: string, productId: string): Promise<{ message: string } | null> {
    const dataSource = await getTenantConnection(tenantDbName);
    const productRepo = dataSource.getRepository(Product);
    
    // Check if product exists
    const existingProduct = await productRepo.findOneBy({ product_id: productId });
    if (!existingProduct) {
      return null;
    }

    // Delete the product
    await productRepo.delete({ product_id: productId });
    
    return { message: 'Product deleted successfully' };
  }
}