import { Controller, Get, Post, Req, UseGuards, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { JwtTenantGuard } from '../../auth/guards/jwt-tenant.guard';
import { CreateProductDto } from '../dto/create-product.dto';

@ApiTags('Products')
@ApiBearerAuth('JWT-auth')
@Controller('products')
@UseGuards(JwtTenantGuard) // Use JWT-based tenant guard
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'List products for tenant.' })
  async getProducts(@Req() req) {
    return this.productService.findAll(req.tenantDbName);
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
}