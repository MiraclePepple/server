import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiQuery, ApiBody, ApiOperation } from '@nestjs/swagger';
import { JwtTenantGuard } from '../../auth/guards/jwt-tenant.guard';
import { LocationService } from '../services/location.service';
import { CreateLocationDto, UpdateLocationDto } from '../dto/location.dto';

@ApiTags('Inventory - Locations')
@ApiBearerAuth('JWT-auth')
@Controller('locations')
@UseGuards(JwtTenantGuard)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @ApiOperation({ summary: 'Create New Location', description: 'Add new store, warehouse, or inventory location for multi-location businesses' })
  @ApiBody({ type: CreateLocationDto })
  @ApiResponse({ status: 201, description: 'Location created.' })
  create(@Req() req, @Body() dto: CreateLocationDto) {
    return this.locationService.createLocation(req.tenantDbName, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List All Locations', description: 'Retrieve paginated list of all stores and warehouses' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10, max: 100)' })
  @ApiResponse({ status: 200, description: 'List locations (paginated).' })
  getAll(@Req() req) {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.max(1, Math.min(parseInt(req.query.limit) || 10, 100));
    return this.locationService.getLocations(req.tenantDbName, { page, limit });
  }

  @Get('active')
  @ApiOperation({ summary: 'List Active Locations', description: 'Get only currently operating locations for inventory transfers and POS' })
  @ApiResponse({ status: 200, description: 'List active locations only.' })
  getActive(@Req() req) {
    return this.locationService.getActiveLocations(req.tenantDbName);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Location Details', description: 'Retrieve specific location information with address and inventory summary' })
  @ApiResponse({ status: 200, description: 'Get location by ID.' })
  getById(@Req() req, @Param('id') id: string) {
    return this.locationService.getLocationById(req.tenantDbName, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Location', description: 'Modify location details such as address, contact info, or operational status' })
  @ApiBody({ type: UpdateLocationDto })
  @ApiResponse({ status: 200, description: 'Update location.' })
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateLocationDto) {
    return this.locationService.updateLocation(req.tenantDbName, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Location', description: 'Remove location from system (transfer inventory first to avoid data loss)' })
  @ApiResponse({ status: 200, description: 'Delete location.' })
  delete(@Req() req, @Param('id') id: string) {
    return this.locationService.deleteLocation(req.tenantDbName, id);
  }
}