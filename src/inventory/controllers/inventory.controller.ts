import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { InventoryService } from '../services/inventory.service';
import { TenantGuard } from '../../guards/tenant.guard';
import {
  StockAdjustmentDto,
  StockTransferDto,
  InventoryQueryDto
} from '../dto/inventory.dto';

@ApiTags('Inventory Management')
@ApiBearerAuth('JWT-auth')
@Controller('inventory')
@UseGuards(TenantGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get Inventory Overview', description: 'Retrieve current stock levels across all locations with filtering options' })
  @ApiResponse({ status: 200, description: 'Inventory data retrieved successfully' })
  async getInventory(
    @Request() req,
    @Query() query: InventoryQueryDto
  ) {
    return this.inventoryService.getInventory(req.tenantDbName, query);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get Product Stock Levels', description: 'View stock levels for a specific product across all locations' })
  @ApiResponse({ status: 200, description: 'Product inventory retrieved successfully' })
  async getInventoryByProduct(
    @Request() req,
    @Param('productId') productId: string
  ) {
    return this.inventoryService.getInventoryByProduct(req.tenantDbName, productId);
  }

  @Get('location/:locationId')
  @ApiOperation({ summary: 'Get Location Inventory', description: 'View all product stock levels at a specific location/store' })
  @ApiResponse({ status: 200, description: 'Location inventory retrieved successfully' })
  async getInventoryByLocation(
    @Request() req,
    @Param('locationId') locationId: string,
    @Query() query: InventoryQueryDto
  ) {
    return this.inventoryService.getInventoryByLocation(req.tenantDbName, locationId, query);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get Low Stock Alerts', description: 'Identify products that need restocking based on minimum stock levels' })
  @ApiResponse({ status: 200, description: 'Low stock items retrieved successfully' })
  async getLowStockItems(
    @Request() req,
    @Query() query: InventoryQueryDto
  ) {
    return this.inventoryService.getLowStockItems(req.tenantDbName, query);
  }

  @Post('adjust')
  @ApiOperation({ summary: 'Adjust Stock Levels', description: 'Manually adjust inventory quantities for discrepancies, damage, or loss' })
  @ApiBody({
    type: StockAdjustmentDto,
    examples: {
      physicalCount: {
        summary: 'Physical Count Correction',
        description: 'Adjust based on physical inventory count',
        value: {
          product_id: 'use-actual-product-uuid-from-your-products',
          location_id: 'use-actual-location-uuid-from-your-locations', 
          new_quantity: 85,
          reason: 'Physical Count',
          notes: 'Quarterly inventory count revealed 85 units (was showing 92)'
        }
      },
      damage: {
        summary: 'Damage Write-off',
        description: 'Remove damaged inventory',
        value: {
          product_id: 'use-actual-product-uuid-from-your-products',
          location_id: 'use-actual-location-uuid-from-your-locations',
          new_quantity: 0,
          reason: 'Damage',
          notes: 'Water damage from roof leak - 5 units lost'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Stock adjustment recorded successfully' })
  async adjustStock(
    @Request() req,
    @Body() adjustment: StockAdjustmentDto
  ) {
    return this.inventoryService.adjustStock(
      req.tenantDbName,
      adjustment,
      req.user?.sub
    );
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer Stock Between Locations', description: 'Move inventory from one store/warehouse to another location' })
  @ApiResponse({ status: 201, description: 'Stock transfer completed successfully' })
  async transferStock(
    @Request() req,
    @Body() transfer: StockTransferDto
  ) {
    return this.inventoryService.transferStock(
      req.tenantDbName,
      transfer,
      req.user?.sub
    );
  }

  @Post('reserve')
  @ApiOperation({ summary: 'Reserve Stock for Sale', description: 'Hold inventory items temporarily during sales transaction processing' })
  @ApiResponse({ status: 201, description: 'Stock reserved successfully' })
  async reserveStock(
    @Request() req,
    @Body() body: { product_id: string; location_id: string; quantity: number; notes?: string }
  ) {
    return this.inventoryService.reserveStock(
      req.tenantDbName,
      body.product_id,
      body.location_id,
      body.quantity,
      body.notes,
      req.user?.sub
    );
  }

  @Post('release-reserve')
  @ApiOperation({ summary: 'Release Reserved Stock', description: 'Free up reserved inventory when sale is cancelled or completed' })
  @ApiResponse({ status: 201, description: 'Reserved stock released successfully' })
  async releaseReservedStock(
    @Request() req,
    @Body() body: { product_id: string; location_id: string; quantity: number; notes?: string }
  ) {
    return this.inventoryService.releaseReservedStock(
      req.tenantDbName,
      body.product_id,
      body.location_id,
      body.quantity,
      body.notes,
      req.user?.sub
    );
  }

  @Get('movements')
  @ApiOperation({ summary: 'Get Stock Movement History', description: 'View complete audit trail of all inventory transactions and changes' })
  @ApiResponse({ status: 200, description: 'Stock movements retrieved successfully' })
  async getStockMovements(
    @Request() req,
    @Query() query: any
  ) {
    return this.inventoryService.getStockMovements(req.tenantDbName, query);
  }

  @Get('movements/product/:productId')
  @ApiOperation({ summary: 'Get Product Movement History', description: 'View movement history for a specific product across all locations' })
  @ApiResponse({ status: 200, description: 'Product movements retrieved successfully' })
  async getProductMovements(
    @Request() req,
    @Param('productId') productId: string,
    @Query() query: any
  ) {
    return this.inventoryService.getProductMovements(req.tenantDbName, productId, query);
  }
}