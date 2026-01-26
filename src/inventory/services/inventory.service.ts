import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { getTenantConnection } from '../../database/tenant-connection.manager';
import { Inventory } from '../entities/inventory.entity';
import { StockMovement, MovementType } from '../entities/stock-movement.entity';
import { Product } from '../../products/entities/product.entity';
import { Location } from '../entities/location.entity';
import { InventoryQueryDto } from '../dto/inventory.dto';

export interface StockAdjustmentDto {
  product_id: string;
  location_id: string;
  new_quantity: number;
  reason?: string;
  notes?: string;
}

export interface StockTransferDto {
  product_id: string;
  from_location_id: string;
  to_location_id: string;
  quantity: number;
  notes?: string;
}

@Injectable()
export class InventoryService {
  
  // Get current stock for a product at a specific location
  async getProductStock(tenantDbName: string, productId: string, locationId: string): Promise<Inventory | null> {
    const dataSource = await getTenantConnection(tenantDbName);
    const repo = dataSource.getRepository(Inventory);
    return repo.findOne({
      where: { product_id: productId, location_id: locationId },
      relations: ['product', 'location']
    });
  }

  // Get all stock levels for a product across all locations
  async getProductStockAllLocations(tenantDbName: string, productId: string): Promise<Inventory[]> {
    const dataSource = await getTenantConnection(tenantDbName);
    const repo = dataSource.getRepository(Inventory);
    return repo.find({
      where: { product_id: productId },
      relations: ['location'],
      order: { location: { name: 'ASC' } }
    });
  }

  // Get low stock items (below threshold)
  async getLowStockItems(tenantDbName: string, query: InventoryQueryDto = {}) {
    const dataSource = await getTenantConnection(tenantDbName);
    const inventoryRepo = dataSource.getRepository(Inventory);
    
    const queryBuilder = inventoryRepo
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.location', 'location')
      .where('inventory.quantity <= product.low_stock_threshold');
    
    if (query.location_id) {
      queryBuilder.andWhere('inventory.location_id = :locationId', { locationId: query.location_id });
    }

    if (query.search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.sku ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);
    
    const [items, total] = await queryBuilder
      .orderBy('inventory.quantity', 'ASC')
      .getManyAndCount();

    return {
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Adjust stock quantity manually
  async adjustStock(tenantDbName: string, adjustment: StockAdjustmentDto, userId?: string): Promise<Inventory> {
    const dataSource = await getTenantConnection(tenantDbName);
    const inventoryRepo = dataSource.getRepository(Inventory);
    const movementRepo = dataSource.getRepository(StockMovement);

    // Validate product and location exist
    await this.validateProductAndLocation(tenantDbName, adjustment.product_id, adjustment.location_id);

    // Find existing inventory record or create new one
    let inventory = await inventoryRepo.findOne({
      where: { product_id: adjustment.product_id, location_id: adjustment.location_id }
    });

    const previousQuantity = inventory?.quantity || 0;
    
    if (!inventory) {
      inventory = inventoryRepo.create({
        product_id: adjustment.product_id,
        location_id: adjustment.location_id,
        quantity: adjustment.new_quantity,
        reserved_quantity: 0,
        minimum_stock: 0
      });
    } else {
      inventory.quantity = adjustment.new_quantity;
      inventory.last_updated = new Date();
    }

    // Save updated inventory
    const savedInventory = await inventoryRepo.save(inventory);

    // Record stock movement
    await movementRepo.save({
      product_id: adjustment.product_id,
      location_id: adjustment.location_id,
      movement_type: MovementType.ADJUSTMENT,
      quantity: adjustment.new_quantity - previousQuantity,
      previous_quantity: previousQuantity,
      new_quantity: adjustment.new_quantity,
      notes: adjustment.notes,
      created_by: userId
    });

    const result = await inventoryRepo.findOne({
      where: { inventory_id: savedInventory.inventory_id },
      relations: ['product', 'location']
    });
    
    if (!result) {
      throw new Error('Failed to retrieve updated inventory');
    }
    
    return result;
  }

  // Transfer stock between locations
  async transferStock(tenantDbName: string, transfer: StockTransferDto, userId?: string): Promise<{from: Inventory, to: Inventory}> {
    const dataSource = await getTenantConnection(tenantDbName);
    const inventoryRepo = dataSource.getRepository(Inventory);
    const movementRepo = dataSource.getRepository(StockMovement);

    // Validate locations
    await this.validateProductAndLocation(tenantDbName, transfer.product_id, transfer.from_location_id);
    await this.validateProductAndLocation(tenantDbName, transfer.product_id, transfer.to_location_id);

    // Get source inventory
    const fromInventory = await inventoryRepo.findOne({
      where: { product_id: transfer.product_id, location_id: transfer.from_location_id }
    });

    if (!fromInventory || fromInventory.quantity < transfer.quantity) {
      throw new BadRequestException('Insufficient stock for transfer');
    }

    // Get or create destination inventory
    let toInventory = await inventoryRepo.findOne({
      where: { product_id: transfer.product_id, location_id: transfer.to_location_id }
    });

    if (!toInventory) {
      toInventory = inventoryRepo.create({
        product_id: transfer.product_id,
        location_id: transfer.to_location_id,
        quantity: 0,
        reserved_quantity: 0,
        minimum_stock: 0
      });
    }

    // Update quantities
    const fromPreviousQty = fromInventory.quantity;
    const toPreviousQty = toInventory.quantity;
    
    fromInventory.quantity -= transfer.quantity;
    toInventory.quantity += transfer.quantity;
    
    fromInventory.last_updated = new Date();
    toInventory.last_updated = new Date();

    // Save both inventories
    const savedFrom = await inventoryRepo.save(fromInventory);
    const savedTo = await inventoryRepo.save(toInventory);

    // Record movements
    await movementRepo.save([
      {
        product_id: transfer.product_id,
        location_id: transfer.from_location_id,
        movement_type: MovementType.TRANSFER_OUT,
        quantity: -transfer.quantity,
        previous_quantity: fromPreviousQty,
        new_quantity: fromInventory.quantity,
        notes: transfer.notes,
        created_by: userId
      },
      {
        product_id: transfer.product_id,
        location_id: transfer.to_location_id,
        movement_type: MovementType.TRANSFER_IN,
        quantity: transfer.quantity,
        previous_quantity: toPreviousQty,
        new_quantity: toInventory.quantity,
        notes: transfer.notes,
        created_by: userId
      }
    ]);

    return {
      from: await inventoryRepo.findOne({
        where: { inventory_id: savedFrom.inventory_id },
        relations: ['product', 'location']
      }) as Inventory,
      to: await inventoryRepo.findOne({
        where: { inventory_id: savedTo.inventory_id },
        relations: ['product', 'location']
      }) as Inventory
    };
  }

  // Get stock movement history
  async getInventoryByProduct(tenantDbName: string, productId: string) {
    const dataSource = await getTenantConnection(tenantDbName);
    const repo = dataSource.getRepository(Inventory);
    
    return repo.find({
      where: { product_id: productId },
      relations: ['location'],
      order: { location: { name: 'ASC' } }
    });
  }

  private async validateProductAndLocation(tenantDbName: string, productId: string, locationId: string) {
    const dataSource = await getTenantConnection(tenantDbName);
    
    const product = await dataSource.getRepository(Product).findOneBy({ product_id: productId });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    
    const location = await dataSource.getRepository(Location).findOneBy({ location_id: locationId });
    if (!location) {
      throw new NotFoundException('Location not found');
    }
  }

  // Get all inventory with optional filters
  async getInventory(tenantDbName: string, query: InventoryQueryDto = {}) {
    const dataSource = await getTenantConnection(tenantDbName);
    const repo = dataSource.getRepository(Inventory);
    
    const queryBuilder = repo.createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.location', 'location');

    if (query.product_id) {
      queryBuilder.andWhere('inventory.product_id = :productId', { productId: query.product_id });
    }

    if (query.location_id) {
      queryBuilder.andWhere('inventory.location_id = :locationId', { locationId: query.location_id });
    }

    if (query.search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.sku ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);
    
    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Get inventory by location with pagination
  async getInventoryByLocation(tenantDbName: string, locationId: string, query: InventoryQueryDto = {}) {
    const dataSource = await getTenantConnection(tenantDbName);
    const repo = dataSource.getRepository(Inventory);
    
    const queryBuilder = repo.createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.location', 'location')
      .where('inventory.location_id = :locationId', { locationId });

    if (query.search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.sku ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);
    
    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Reserve stock for orders
  async reserveStock(tenantDbName: string, productId: string, locationId: string, quantity: number, notes?: string, userId?: string) {
    const dataSource = await getTenantConnection(tenantDbName);
    const inventoryRepo = dataSource.getRepository(Inventory);
    const movementRepo = dataSource.getRepository(StockMovement);

    let inventory = await inventoryRepo.findOne({
      where: { product_id: productId, location_id: locationId }
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    const availableStock = inventory.quantity - inventory.reserved_quantity;
    if (availableStock < quantity) {
      throw new BadRequestException('Insufficient available stock');
    }

    inventory.reserved_quantity += quantity;
    const savedInventory = await inventoryRepo.save(inventory);

    // Record movement
    await movementRepo.save({
      product_id: productId,
      location_id: locationId,
      movement_type: MovementType.RESERVED,
      quantity: quantity,
      previous_quantity: inventory.reserved_quantity - quantity,
      new_quantity: inventory.reserved_quantity,
      notes,
      created_by: userId
    });

    return savedInventory;
  }

  // Release reserved stock
  async releaseReservedStock(tenantDbName: string, productId: string, locationId: string, quantity: number, notes?: string, userId?: string) {
    const dataSource = await getTenantConnection(tenantDbName);
    const inventoryRepo = dataSource.getRepository(Inventory);
    const movementRepo = dataSource.getRepository(StockMovement);

    let inventory = await inventoryRepo.findOne({
      where: { product_id: productId, location_id: locationId }
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    if (inventory.reserved_quantity < quantity) {
      throw new BadRequestException('Cannot release more than reserved quantity');
    }

    inventory.reserved_quantity -= quantity;
    const savedInventory = await inventoryRepo.save(inventory);

    // Record movement
    await movementRepo.save({
      product_id: productId,
      location_id: locationId,
      movement_type: MovementType.RELEASED,
      quantity: -quantity,
      previous_quantity: inventory.reserved_quantity + quantity,
      new_quantity: inventory.reserved_quantity,
      notes,
      created_by: userId
    });

    return savedInventory;
  }

  // Get stock movements with pagination
  async getStockMovements(tenantDbName: string, query: any = {}) {
    const dataSource = await getTenantConnection(tenantDbName);
    const repo = dataSource.getRepository(StockMovement);
    
    const queryBuilder = repo.createQueryBuilder('movement')
      .leftJoinAndSelect('movement.product', 'product')
      .leftJoinAndSelect('movement.location', 'location')
      .orderBy('movement.created_at', 'DESC');

    if (query.product_id) {
      queryBuilder.andWhere('movement.product_id = :productId', { productId: query.product_id });
    }

    if (query.location_id) {
      queryBuilder.andWhere('movement.location_id = :locationId', { locationId: query.location_id });
    }

    if (query.movement_type) {
      queryBuilder.andWhere('movement.movement_type = :movementType', { movementType: query.movement_type });
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);
    
    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Get stock movements for a specific product
  async getProductMovements(tenantDbName: string, productId: string, query: any = {}) {
    const dataSource = await getTenantConnection(tenantDbName);
    const repo = dataSource.getRepository(StockMovement);
    
    const queryBuilder = repo.createQueryBuilder('movement')
      .leftJoinAndSelect('movement.product', 'product')
      .leftJoinAndSelect('movement.location', 'location')
      .where('movement.product_id = :productId', { productId })
      .orderBy('movement.created_at', 'DESC');

    if (query.location_id) {
      queryBuilder.andWhere('movement.location_id = :locationId', { locationId: query.location_id });
    }

    if (query.movement_type) {
      queryBuilder.andWhere('movement.movement_type = :movementType', { movementType: query.movement_type });
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);
    
    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}