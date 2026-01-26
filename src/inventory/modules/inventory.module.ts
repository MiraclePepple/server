import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '../../shared/modules/shared.module';
import { Tenant } from '../../tenant/entities/tenancy.entity';
import { Location } from '../entities/location.entity';
import { Inventory } from '../entities/inventory.entity';
import { StockMovement } from '../entities/stock-movement.entity';
import { LocationController } from '../controllers/location.controller';
import { InventoryController } from '../controllers/inventory.controller';
import { LocationService } from '../services/location.service';
import { InventoryService } from '../services/inventory.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant, Location, Inventory, StockMovement]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'changeme',
      signOptions: { expiresIn: '1d' },
    }),
    SharedModule,
  ],
  providers: [LocationService, InventoryService],
  controllers: [LocationController, InventoryController],
  exports: [LocationService, InventoryService],
})
export class InventoryModule {}