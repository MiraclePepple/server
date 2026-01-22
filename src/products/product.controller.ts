import { Controller, Get, Post, Req, UseGuards, Body, Param } from '@nestjs/common';
import { ApiTags, ApiHeader, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { TenantGuard } from '../guards/tenant.guard';
import { CreateProductDto } from './dto/create-product.dto';

@ApiTags('Products')
@Controller('products')
@UseGuards(TenantGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiHeader({ name: 'x-tenant-db', description: 'Tenant database name', required: true, example: 'tenant_myshop_abc123' })
  @ApiResponse({ status: 200, description: 'List products for tenant.' })
  async getProducts(@Req() req) {
    return this.productService.findAll(req.tenantId);
  }

  @Post()
  @ApiHeader({ name: 'x-tenant-db', description: 'Tenant database name', required: true, example: 'tenant_myshop_abc123' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created.' })
  createProduct(
    @Req() req,
    @Body() data: CreateProductDto,
  ) {
    return this.productService.createProduct(req.tenantDbName, data);
  }

  @Get(':id')
  @ApiHeader({ name: 'x-tenant-db', description: 'Tenant database name', required: true, example: 'tenant_myshop_abc123' })
  @ApiResponse({ status: 200, description: 'Product details.' })
  async getProductById(
    @Req() req,
    @Param('id') id: string,
  ) {
    return this.productService.findById(req.tenantDbName, id);
  }
}