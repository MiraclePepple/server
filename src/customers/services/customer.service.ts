import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { getTenantConnection } from '../../database/tenant-connection.manager';
import { Customer } from '../entities/customer.entity';
import { CustomerAddress } from '../entities/customer-address.entity';
import { CreateCustomerDto, UpdateCustomerDto, CustomerQueryDto, CreateCustomerAddressDto, UpdateCustomerAddressDto } from '../dto/customer.dto';
import { Like, FindOptionsWhere, In } from 'typeorm';

@Injectable()
export class CustomerService {
  // Create new customer
  async createCustomer(tenantDbName: string, createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const dataSource = await getTenantConnection(tenantDbName);
    const customerRepo = dataSource.getRepository(Customer);

    // Check if email already exists
    const existingCustomer = await customerRepo.findOne({
      where: { email: createCustomerDto.email }
    });

    if (existingCustomer) {
      throw new ConflictException('Customer with this email already exists');
    }

    const customer = customerRepo.create(createCustomerDto);
    return await customerRepo.save(customer);
  }

  // Get all customers with pagination and filters
  async getAllCustomers(tenantDbName: string, query: CustomerQueryDto = {}) {
    const dataSource = await getTenantConnection(tenantDbName);
    const customerRepo = dataSource.getRepository(Customer);

    const queryBuilder = customerRepo.createQueryBuilder('customer')
      .where('customer.deleted_at IS NULL');

    // Apply filters
    if (query.search) {
      queryBuilder.andWhere(
        '(customer.first_name ILIKE :search OR customer.last_name ILIKE :search OR customer.email ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    if (query.status) {
      queryBuilder.andWhere('customer.status = :status', { status: query.status });
    }

    if (query.loyalty_tier) {
      queryBuilder.andWhere('customer.loyalty_tier = :loyalty_tier', { loyalty_tier: query.loyalty_tier });
    }

    if (query.city) {
      queryBuilder.andWhere('customer.city ILIKE :city', { city: `%${query.city}%` });
    }

    if (query.state) {
      queryBuilder.andWhere('customer.state ILIKE :state', { state: `%${query.state}%` });
    }

    if (query.tag) {
      queryBuilder.andWhere('customer.tags @> :tag', { tag: JSON.stringify([query.tag]) });
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder
      .orderBy('customer.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    const [customers, total] = await queryBuilder.getManyAndCount();

    return {
      data: customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Get customer by ID
  async getCustomerById(tenantDbName: string, customerId: string): Promise<Customer> {
    const dataSource = await getTenantConnection(tenantDbName);
    const customerRepo = dataSource.getRepository(Customer);

    const customer = await customerRepo.findOne({
      where: { customer_id: customerId, deleted_at: null as any }
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  // Update customer
  async updateCustomer(tenantDbName: string, customerId: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const dataSource = await getTenantConnection(tenantDbName);
    const customerRepo = dataSource.getRepository(Customer);

    const customer = await this.getCustomerById(tenantDbName, customerId);

    // Check if email is being changed and if it's already taken
    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const existingCustomer = await customerRepo.findOne({
        where: { email: updateCustomerDto.email }
      });
      if (existingCustomer) {
        throw new ConflictException('Email already taken by another customer');
      }
    }

    Object.assign(customer, updateCustomerDto);
    return await customerRepo.save(customer);
  }

  // Delete customer (soft delete)
  async deleteCustomer(tenantDbName: string, customerId: string): Promise<void> {
    const customer = await this.getCustomerById(tenantDbName, customerId);
    
    const dataSource = await getTenantConnection(tenantDbName);
    const customerRepo = dataSource.getRepository(Customer);

    customer.deleted_at = new Date();
    await customerRepo.save(customer);
  }

  // Get customer statistics
  async getCustomerStats(tenantDbName: string) {
    const dataSource = await getTenantConnection(tenantDbName);
    const customerRepo = dataSource.getRepository(Customer);

    const [totalCustomers, activeCustomers, newThisMonth, topSpenders] = await Promise.all([
      customerRepo.count({ where: { deleted_at: null as any } }),
      customerRepo.count({ where: { status: 'active', deleted_at: null as any } }),
      customerRepo
        .createQueryBuilder('customer')
        .where('customer.created_at >= :startOfMonth', { 
          startOfMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
        })
        .andWhere('customer.deleted_at IS NULL')
        .getCount(),
      customerRepo.find({
        where: { deleted_at: null as any },
        order: { total_spent: 'DESC' },
        take: 5
      })
    ]);

    const loyaltyTierCounts = await customerRepo
      .createQueryBuilder('customer')
      .select('customer.loyalty_tier', 'tier')
      .addSelect('COUNT(*)', 'count')
      .where('customer.deleted_at IS NULL')
      .groupBy('customer.loyalty_tier')
      .getRawMany();

    return {
      totalCustomers,
      activeCustomers,
      newThisMonth,
      loyaltyTierDistribution: loyaltyTierCounts,
      topSpenders: topSpenders.map(c => ({
        customer_id: c.customer_id,
        full_name: c.full_name,
        email: c.email,
        total_spent: c.total_spent
      }))
    };
  }

  // Update loyalty points
  async updateLoyaltyPoints(tenantDbName: string, customerId: string, points: number, operation: 'add' | 'subtract' | 'set' = 'add') {
    const customer = await this.getCustomerById(tenantDbName, customerId);
    
    const dataSource = await getTenantConnection(tenantDbName);
    const customerRepo = dataSource.getRepository(Customer);

    switch (operation) {
      case 'add':
        customer.loyalty_points += points;
        break;
      case 'subtract':
        customer.loyalty_points = Math.max(0, customer.loyalty_points - points);
        break;
      case 'set':
        customer.loyalty_points = Math.max(0, points);
        break;
    }

    // Auto-update loyalty tier based on points
    if (customer.loyalty_points >= 10000) {
      customer.loyalty_tier = 'platinum';
    } else if (customer.loyalty_points >= 5000) {
      customer.loyalty_tier = 'gold';
    } else if (customer.loyalty_points >= 1000) {
      customer.loyalty_tier = 'silver';
    } else {
      customer.loyalty_tier = 'bronze';
    }

    return await customerRepo.save(customer);
  }

  // Address management
  async getCustomerAddresses(tenantDbName: string, customerId: string): Promise<CustomerAddress[]> {
    await this.getCustomerById(tenantDbName, customerId); // Verify customer exists
    
    const dataSource = await getTenantConnection(tenantDbName);
    const addressRepo = dataSource.getRepository(CustomerAddress);

    return await addressRepo.find({
      where: { customer_id: customerId },
      order: { is_default: 'DESC', created_at: 'ASC' }
    });
  }

  async createCustomerAddress(tenantDbName: string, customerId: string, createAddressDto: CreateCustomerAddressDto): Promise<CustomerAddress> {
    await this.getCustomerById(tenantDbName, customerId); // Verify customer exists
    
    const dataSource = await getTenantConnection(tenantDbName);
    const addressRepo = dataSource.getRepository(CustomerAddress);

    // If this is being set as default, unset other defaults
    if (createAddressDto.is_default) {
      await addressRepo.update(
        { customer_id: customerId },
        { is_default: false }
      );
    }

    const address = addressRepo.create({
      ...createAddressDto,
      customer_id: customerId
    });

    return await addressRepo.save(address);
  }

  async updateCustomerAddress(tenantDbName: string, customerId: string, addressId: string, updateAddressDto: UpdateCustomerAddressDto): Promise<CustomerAddress> {
    await this.getCustomerById(tenantDbName, customerId); // Verify customer exists
    
    const dataSource = await getTenantConnection(tenantDbName);
    const addressRepo = dataSource.getRepository(CustomerAddress);

    const address = await addressRepo.findOne({
      where: { address_id: addressId, customer_id: customerId }
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    // If this is being set as default, unset other defaults
    if (updateAddressDto.is_default) {
      await addressRepo.update(
        { customer_id: customerId },
        { is_default: false }
      );
    }

    Object.assign(address, updateAddressDto);
    return await addressRepo.save(address);
  }

  async deleteCustomerAddress(tenantDbName: string, customerId: string, addressId: string): Promise<void> {
    await this.getCustomerById(tenantDbName, customerId); // Verify customer exists
    
    const dataSource = await getTenantConnection(tenantDbName);
    const addressRepo = dataSource.getRepository(CustomerAddress);

    const result = await addressRepo.delete({
      address_id: addressId,
      customer_id: customerId
    });

    if (result.affected === 0) {
      throw new NotFoundException('Address not found');
    }
  }

  // Search customers by various criteria
  async searchCustomers(tenantDbName: string, searchTerm: string, limit: number = 10) {
    const dataSource = await getTenantConnection(tenantDbName);
    const customerRepo = dataSource.getRepository(Customer);

    return await customerRepo
      .createQueryBuilder('customer')
      .where('customer.deleted_at IS NULL')
      .andWhere(
        '(customer.first_name ILIKE :search OR customer.last_name ILIKE :search OR customer.email ILIKE :search OR customer.phone ILIKE :search)',
        { search: `%${searchTerm}%` }
      )
      .orderBy('customer.total_spent', 'DESC')
      .take(limit)
      .getMany();
  }
}