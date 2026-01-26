import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getTenantConnection } from '../../database/tenant-connection.manager';
import { Product } from '../entities/product.entity';
import { ProductCategory } from '../entities/category.entity';
import { CreateProductDto, UpdateProductDto } from '../dto/create-product.dto';
import { Tenant } from '../../tenant/entities/tenancy.entity';

@Injectable()
export class ProductService {
  // constructor(
  //   @InjectRepository(Tenant)
  //   private readonly tenantRepo: Repository<Tenant>,
  // ) {}

  private generateSKU(productName: string): string {
    const prefix = productName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
    const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${suffix}`;
  }

  private generateBarcode(): string {
    // Generate a 12-digit UPC barcode (without check digit)
    const randomDigits = Math.floor(Math.random() * 999999999999).toString().padStart(12, '0');
    return randomDigits;
  }

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
      relations: ['category'],
    });
    return { items, total, page, limit };
  }

  async createProduct(tenantDbName: string, data: CreateProductDto) {
    const dataSource = await getTenantConnection(tenantDbName);
    const productRepo = dataSource.getRepository(Product);
    const categoryRepo = dataSource.getRepository(ProductCategory);

    // Auto-generate SKU if not provided
    if (!data.sku) {
      data.sku = this.generateSKU(data.name);
    }

    // Auto-generate Barcode if not provided
    if (!data.barcode) {
      data.barcode = this.generateBarcode();
    }

    // Handle category assignment
    let category: ProductCategory | null = null;
    if (data.category_id) {
      category = await categoryRepo.findOneBy({ category_id: data.category_id });
      if (!category) {
        throw new Error(`Category with ID ${data.category_id} not found`);
      }
    }

    const product = productRepo.create(data);
    if (category) {
      product.category = category;
    }
    return productRepo.save(product);
  }

  async findById(tenantDbName: string, productId: string): Promise<Product | null> {
    const dataSource = await getTenantConnection(tenantDbName);
    const productRepo = dataSource.getRepository(Product);
    return productRepo.findOne({ 
      where: { product_id: productId },
      relations: ['category']
    });
  }

  async updateProduct(tenantDbName: string, productId: string, data: UpdateProductDto): Promise<Product | null> {
    const dataSource = await getTenantConnection(tenantDbName);
    const productRepo = dataSource.getRepository(Product);
    const categoryRepo = dataSource.getRepository(ProductCategory);
    
    // Check if product exists
    const existingProduct = await productRepo.findOne({ 
      where: { product_id: productId },
      relations: ['category']
    });
    if (!existingProduct) {
      return null;
    }

    // Handle category assignment
    if (data.category_id !== undefined) {
      if (data.category_id === null || data.category_id === '') {
        existingProduct.category = undefined;
      } else {
        const category = await categoryRepo.findOneBy({ category_id: data.category_id });
        if (!category) {
          throw new Error(`Category with ID ${data.category_id} not found`);
        }
        existingProduct.category = category;
      }
    }

    // Update other fields
    Object.assign(existingProduct, data);
    
    return productRepo.save(existingProduct);
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