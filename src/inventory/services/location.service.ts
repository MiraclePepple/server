import { Injectable, NotFoundException } from '@nestjs/common';
import { getTenantConnection } from '../../database/tenant-connection.manager';
import { Location } from '../entities/location.entity';
import { CreateLocationDto, UpdateLocationDto } from '../dto/location.dto';

@Injectable()
export class LocationService {
  async createLocation(tenantDbName: string, dto: CreateLocationDto): Promise<Location> {
    const dataSource = await getTenantConnection(tenantDbName);
    const repo = dataSource.getRepository(Location);
    const location = repo.create(dto);
    return repo.save(location);
  }

  async getLocations(tenantDbName: string, options?: { page?: number; limit?: number }) {
    const dataSource = await getTenantConnection(tenantDbName);
    const repo = dataSource.getRepository(Location);
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const [items, total] = await repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });
    return { items, total, page, limit };
  }

  async getLocationById(tenantDbName: string, id: string): Promise<Location> {
    const dataSource = await getTenantConnection(tenantDbName);
    const repo = dataSource.getRepository(Location);
    const location = await repo.findOneBy({ location_id: id });
    if (!location) throw new NotFoundException('Location not found');
    return location;
  }

  async updateLocation(tenantDbName: string, id: string, dto: UpdateLocationDto): Promise<Location> {
    const dataSource = await getTenantConnection(tenantDbName);
    const repo = dataSource.getRepository(Location);
    const location = await repo.findOneBy({ location_id: id });
    if (!location) throw new NotFoundException('Location not found');
    Object.assign(location, dto);
    return repo.save(location);
  }

  async deleteLocation(tenantDbName: string, id: string): Promise<{ message: string }> {
    const dataSource = await getTenantConnection(tenantDbName);
    const repo = dataSource.getRepository(Location);
    const location = await repo.findOneBy({ location_id: id });
    if (!location) throw new NotFoundException('Location not found');
    await repo.remove(location);
    return { message: 'Location deleted successfully' };
  }

  async getActiveLocations(tenantDbName: string): Promise<Location[]> {
    const dataSource = await getTenantConnection(tenantDbName);
    const repo = dataSource.getRepository(Location);
    return repo.find({
      where: { is_active: true },
      order: { name: 'ASC' },
    });
  }
}