import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { TenantGuard } from '../guards/tenant.guard';

@Controller('products')
@UseGuards(TenantGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(@Req() req) {
    return this.productService.findAll(req.tenantId);
  }
}
