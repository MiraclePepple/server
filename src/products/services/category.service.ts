import { Injectable, NotFoundException } from '@nestjs/common';
import { getTenantConnection } from '../../database/tenant-connection.manager';
import { ProductCategory } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

@Injectable()
export class CategoryService {
  async createCategory(tenantDbName: string, dto: CreateCategoryDto): Promise<ProductCategory> {
    const dataSource = await getTenantConnection(tenantDbName);
    const repo = dataSource.getRepository(ProductCategory);
    const category = repo.create(dto);
    return repo.save(category);
  }

  async getCategories(tenantDbName: string, options?: { page?: number; limit?: number }) {
    const dataSource = await getTenantConnection(tenantDbName);
    const repo = dataSource.getRepository(ProductCategory);
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const [items, total] = await repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });
    return { items, total, page, limit };
  }

  async getCategoryById(tenantDbName: string, id: string): Promise<ProductCategory> {
    const dataSource = await getTenantConnection(tenantDbName);
    const repo = dataSource.getRepository(ProductCategory);
    const category = await repo.findOneBy({ category_id: id });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async updateCategory(tenantDbName: string, id: string, dto: UpdateCategoryDto): Promise<ProductCategory> {
    const dataSource = await getTenantConnection(tenantDbName);
    const repo = dataSource.getRepository(ProductCategory);
    const category = await repo.findOneBy({ category_id: id });
    if (!category) throw new NotFoundException('Category not found');
    Object.assign(category, dto);
    return repo.save(category);
  }

  async deleteCategory(tenantDbName: string, id: string): Promise<{ message: string }> {
    const dataSource = await getTenantConnection(tenantDbName);
    const repo = dataSource.getRepository(ProductCategory);
    const category = await repo.findOneBy({ category_id: id });
    if (!category) throw new NotFoundException('Category not found');
    await repo.remove(category);
    return { message: 'Category deleted successfully' };
  }
}
