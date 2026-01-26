import { Controller, Get, Post, Patch, Delete, Req, UseGuards, Body, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth, ApiHeader, ApiQuery, ApiOperation } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'List All Products', description: 'Retrieve paginated list of products with barcode, pricing, and category information' })
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
  @ApiOperation({ summary: 'Create New Product', description: 'Add new product to inventory with details, pricing, and barcode generation' })
  @ApiBody({ 
    type: CreateProductDto,
    examples: {
      simpleProduct: {
        summary: 'Simple Product',
        description: 'Basic retail item with fixed pricing',
        value: {
          name: 'Organic Coffee Beans 1kg',
          description: 'Premium organic coffee beans from Colombia',
          sku: 'COF-ORG-1KG',
          barcode: '012345678905',
          type: 'simple',
          price: 24.99,
          cost: 15.50,
          low_stock_threshold: 10,
          tax_rate: 8.5
        }
      },
      serviceItem: {
        summary: 'Service Item',
        description: 'Non-inventory service offering',
        value: {
          name: 'Coffee Machine Cleaning',
          description: 'Professional espresso machine cleaning service',
          type: 'service',
          price: 45.00,
          cost: 20.00,
          tax_rate: 8.5
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Product created.' })
  createProduct(
    @Req() req,
    @Body() data: CreateProductDto,
  ) {
    return this.productService.createProduct(req.tenantDbName, data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Product Details', description: 'Retrieve detailed product information including stock levels and pricing' })
  @ApiResponse({ status: 200, description: 'Product details.' })
  async getProductById(
    @Req() req,
    @Param('id') id: string,
  ) {
    return this.productService.findById(req.tenantDbName, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Product', description: 'Modify product information such as price, description, or category' })
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
  @ApiOperation({ summary: 'Delete Product', description: 'Remove product from catalog (soft delete to preserve transaction history)' })
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