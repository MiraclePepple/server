import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
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
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, description: 'Category created.' })
  create(@Req() req, @Body() dto: CreateCategoryDto) {
    return this.categoryService.createCategory(req.tenantDbName, dto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10, max: 100)' })
  @ApiResponse({ status: 200, description: 'List categories (paginated).' })
  getAll(@Req() req) {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.max(1, Math.min(parseInt(req.query.limit) || 10, 100));
    return this.categoryService.getCategories(req.tenantDbName, { page, limit });
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get category by ID.' })
  getById(@Req() req, @Param('id') id: string) {
    return this.categoryService.getCategoryById(req.tenantDbName, id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, description: 'Update category.' })
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(req.tenantDbName, id, dto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Delete category.' })
  delete(@Req() req, @Param('id') id: string) {
    return this.categoryService.deleteCategory(req.tenantDbName, id);
  }
}
