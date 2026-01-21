import { Controller, Get, Post, Req, UseGuards, Headers, Body, Param } from '@nestjs/common';
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
    @Req() req,
    @Body() data: CreateProductDto,
  ) {
    return this.productService.createProduct(req.tenantId, data);
  }

  @Get(':id')
  async getProductById(
    @Req() req,
    @Param('id') id: string,
  ) {
    return this.productService.findById(req.tenantId, id);
  }
}