import { Controller, Get, Post, Patch, Delete, Req, UseGuards, Body, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { JwtTenantGuard } from '../../auth/guards/jwt-tenant.guard';
import { CreateProductDto, UpdateProductDto } from '../dto/create-product.dto';

@ApiTags('Products')
@ApiBearerAuth('JWT-auth')
@Controller('products')
@UseGuards(JwtTenantGuard) // Use JWT-based tenant guard
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'List products for tenant (paginated).' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10, max: 100)' })
  async getProducts(@Req() req) {
    // Accept ?page=1&limit=10 as query params
    const page = parseInt(req.query.page) || 1;
    const limit = Math.max(1, Math.min(parseInt(req.query.limit) || 10, 100)); // 1-100
    return this.productService.findAll(req.tenantDbName, { page, limit });
  }

  @Post()
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created.' })
  createProduct(
    @Req() req,
    @Body() data: CreateProductDto,
  ) {
    return this.productService.createProduct(req.tenantDbName, data);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Product details.' })
  async getProductById(
    @Req() req,
    @Param('id') id: string,
  ) {
    return this.productService.findById(req.tenantDbName, id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product updated.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async updateProduct(
    @Req() req,
    @Param('id') id: string,
    @Body() data: UpdateProductDto,
  ) {
    const result = await this.productService.updateProduct(req.tenantDbName, id, data);
    if (!result) {
      throw new NotFoundException('Product not found');
    }
    return result;
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Product deleted.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async deleteProduct(
    @Req() req,
    @Param('id') id: string,
  ) {
    const result = await this.productService.deleteProduct(req.tenantDbName, id);
    if (!result) {
      throw new NotFoundException('Product not found');
    }
    return result;
  }
}