import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiQuery, ApiBody, ApiOperation } from '@nestjs/swagger';
import { JwtTenantGuard } from '../../auth/guards/jwt-tenant.guard';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

@ApiTags('Product Categories')
@ApiBearerAuth('JWT-auth')
@Controller('categories')
@UseGuards(JwtTenantGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create Product Category', description: 'Add new category to organize products for easier inventory management' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, description: 'Category created.' })
  create(@Req() req, @Body() dto: CreateCategoryDto) {
    return this.categoryService.createCategory(req.tenantDbName, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List All Categories', description: 'Retrieve paginated list of product categories with product counts' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10, max: 100)' })
  @ApiResponse({ status: 200, description: 'List categories (paginated).' })
  getAll(@Req() req) {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.max(1, Math.min(parseInt(req.query.limit) || 10, 100));
    return this.categoryService.getCategories(req.tenantDbName, { page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Category Details', description: 'Retrieve specific category information with associated products' })
  @ApiResponse({ status: 200, description: 'Get category by ID.' })
  getById(@Req() req, @Param('id') id: string) {
    return this.categoryService.getCategoryById(req.tenantDbName, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Category', description: 'Modify category name, description, or display settings' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, description: 'Update category.' })
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(req.tenantDbName, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Category', description: 'Remove category from system (products will become uncategorized)' })
  @ApiResponse({ status: 200, description: 'Delete category.' })
  delete(@Req() req, @Param('id') id: string) {
    return this.categoryService.deleteCategory(req.tenantDbName, id);
  }
}
