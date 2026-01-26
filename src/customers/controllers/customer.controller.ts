import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CustomerService } from '../services/customer.service';
import { TenantGuard } from '../../guards/tenant.guard';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerQueryDto,
  CreateCustomerAddressDto,
  UpdateCustomerAddressDto
} from '../dto/customer.dto';

@ApiTags('Customers')
@ApiBearerAuth()
@Controller('customers')
@UseGuards(TenantGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @ApiOperation({ summary: 'Create New Customer', description: 'Add a new customer to your business database with contact information and preferences' })
  @ApiBody({ 
    type: CreateCustomerDto,
    examples: {
      regularCustomer: {
        summary: 'Regular Customer',
        description: 'Typical walk-in customer registration',
        value: {
          first_name: 'Sarah',
          last_name: 'Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1-555-123-4567',
          date_of_birth: '1985-03-15',
          loyalty_points: 0,
          is_active: true
        }
      },
      loyaltyMember: {
        summary: 'Loyalty Member',
        description: 'Customer signing up for loyalty program',
        value: {
          first_name: 'Mike',
          last_name: 'Davis',
          email: 'mike.davis@email.com',
          phone: '+1-555-987-6543',
          loyalty_points: 100,
          is_active: true
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async createCustomer(
    @Request() req,
    @Body() createCustomerDto: CreateCustomerDto
  ) {
    return this.customerService.createCustomer(req.tenantDbName, createCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Customers retrieved successfully' })
  async getAllCustomers(
    @Request() req,
    @Query() query: CustomerQueryDto
  ) {
    return this.customerService.getAllCustomers(req.tenantDbName, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get customer statistics and analytics' })
  @ApiResponse({ status: 200, description: 'Customer statistics retrieved successfully' })
  async getCustomerStats(@Request() req) {
    return this.customerService.getCustomerStats(req.tenantDbName);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search customers by name, email, or phone' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  async searchCustomers(
    @Request() req,
    @Query('q') searchTerm: string,
    @Query('limit') limit?: number
  ) {
    return this.customerService.searchCustomers(req.tenantDbName, searchTerm, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async getCustomerById(
    @Request() req,
    @Param('id') customerId: string
  ) {
    return this.customerService.getCustomerById(req.tenantDbName, customerId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update customer information' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 409, description: 'Email already taken' })
  async updateCustomer(
    @Request() req,
    @Param('id') customerId: string,
    @Body() updateCustomerDto: UpdateCustomerDto
  ) {
    return this.customerService.updateCustomer(req.tenantDbName, customerId, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete customer (soft delete)' })
  @ApiResponse({ status: 204, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async deleteCustomer(
    @Request() req,
    @Param('id') customerId: string
  ) {
    await this.customerService.deleteCustomer(req.tenantDbName, customerId);
    return { message: 'Customer deleted successfully' };
  }

  @Patch(':id/loyalty-points')
  @ApiOperation({ summary: 'Update customer loyalty points' })
  @ApiResponse({ status: 200, description: 'Loyalty points updated successfully' })
  async updateLoyaltyPoints(
    @Request() req,
    @Param('id') customerId: string,
    @Body() body: { points: number; operation?: 'add' | 'subtract' | 'set' }
  ) {
    return this.customerService.updateLoyaltyPoints(
      req.tenantDbName,
      customerId,
      body.points,
      body.operation
    );
  }

  // Customer Address Management
  @Get(':id/addresses')
  @ApiOperation({ summary: 'Get all addresses for a customer' })
  @ApiResponse({ status: 200, description: 'Customer addresses retrieved successfully' })
  async getCustomerAddresses(
    @Request() req,
    @Param('id') customerId: string
  ) {
    return this.customerService.getCustomerAddresses(req.tenantDbName, customerId);
  }

  @Post(':id/addresses')
  @ApiOperation({ summary: 'Create new address for customer' })
  @ApiResponse({ status: 201, description: 'Address created successfully' })
  async createCustomerAddress(
    @Request() req,
    @Param('id') customerId: string,
    @Body() createAddressDto: CreateCustomerAddressDto
  ) {
    return this.customerService.createCustomerAddress(req.tenantDbName, customerId, createAddressDto);
  }

  @Patch(':id/addresses/:addressId')
  @ApiOperation({ summary: 'Update customer address' })
  @ApiResponse({ status: 200, description: 'Address updated successfully' })
  async updateCustomerAddress(
    @Request() req,
    @Param('id') customerId: string,
    @Param('addressId') addressId: string,
    @Body() updateAddressDto: UpdateCustomerAddressDto
  ) {
    return this.customerService.updateCustomerAddress(
      req.tenantDbName,
      customerId,
      addressId,
      updateAddressDto
    );
  }

  @Delete(':id/addresses/:addressId')
  @ApiOperation({ summary: 'Delete customer address' })
  @ApiResponse({ status: 204, description: 'Address deleted successfully' })
  async deleteCustomerAddress(
    @Request() req,
    @Param('id') customerId: string,
    @Param('addressId') addressId: string
  ) {
    await this.customerService.deleteCustomerAddress(req.tenantDbName, customerId, addressId);
    return { message: 'Address deleted successfully' };
  }
}