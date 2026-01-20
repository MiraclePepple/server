import { Controller, Get, Post, Req, UseGuards, Headers, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { TenantGuard } from '../guards/tenant.guard';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
@UseGuards(TenantGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(@Req() req) {
    return this.productService.findAll(req.tenantId);
  }

  @Post()
  createProduct(
    @Headers('x-tenant-db') tenantDbName: string,
    @Body() data: CreateProductDto,
  ) {
    return this.productService.createProduct(tenantDbName, data);
  }

  @Get(':id')
  async getProductById(
    @Headers('x-tenant-db') tenantDbName: string,
    @Req() req,
  ) {
    return this.productService.findById(req.tenantId, req.params.id);
  }
}