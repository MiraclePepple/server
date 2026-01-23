import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { getTenantConnection } from '../../database/tenant-connection.manager';

@Injectable()
export class UserService {
  // Remove @InjectRepository decorators since we'll use tenant connections dynamically
  
  async findByUsernameOrEmail(usernameOrEmail: string, tenantDbName?: string): Promise<User | null> {
    if (!tenantDbName) {
      throw new Error('Tenant database name is required for user operations');
    }
    
    const dataSource = await getTenantConnection(tenantDbName);
    const userRepo = dataSource.getRepository(User);
    
    return userRepo.findOne({
      where: [
        { username: usernameOrEmail },
        { email: usernameOrEmail },
      ],
      relations: ['roles'],
    });
  }

  async create(data: CreateUserDto, tenantDbName: string): Promise<User> {
    const dataSource = await getTenantConnection(tenantDbName);
    const userRepo = dataSource.getRepository(User);
    const roleRepo = dataSource.getRepository(Role);
    
    // Find roles by names instead of IDs
    const roles = data.roleNames && data.roleNames.length > 0 
      ? await roleRepo.find({ 
          where: data.roleNames.map(name => ({ name })),
          relations: ['permissions']
        })
      : [];
    
    const hashedPassword = await require('bcryptjs').hash(data.password, 10);
    const user = userRepo.create({ 
      username: data.username,
      email: data.email,
      password: hashedPassword,
      full_name: data.full_name,
      phone: data.phone,
      roles 
    });
    return userRepo.save(user);
  }

  async findAll(tenantDbName: string): Promise<User[]> {
    const dataSource = await getTenantConnection(tenantDbName);
    const userRepo = dataSource.getRepository(User);
    return userRepo.find({ relations: ['roles'] });
  }

  async findOne(id: string, tenantDbName: string): Promise<User | null> {
    const dataSource = await getTenantConnection(tenantDbName);
    const userRepo = dataSource.getRepository(User);
    return userRepo.findOne({ where: { user_id: id }, relations: ['roles'] });
  }

  async update(id: string, data: UpdateUserDto, tenantDbName: string): Promise<User | null> {
    const dataSource = await getTenantConnection(tenantDbName);
    const userRepo = dataSource.getRepository(User);
    const roleRepo = dataSource.getRepository(Role);
    
    const user = await userRepo.findOne({ where: { user_id: id }, relations: ['roles'] });
    if (!user) return null;
    
    if (data.roleNames && data.roleNames.length > 0) {
      user.roles = await roleRepo.find({ 
        where: data.roleNames.map(name => ({ name })),
        relations: ['permissions']
      });
    }
    
    if (data.password) {
      data.password = await require('bcryptjs').hash(data.password, 10);
    }
    
    // Update other fields
    if (data.username) user.username = data.username;
    if (data.email) user.email = data.email;
    if (data.full_name !== undefined) user.full_name = data.full_name;
    if (data.phone !== undefined) user.phone = data.phone;
    if (data.is_active !== undefined) user.is_active = data.is_active;
    if (data.password) user.password = data.password;
    
    return userRepo.save(user);
  }

  async remove(id: string, tenantDbName: string): Promise<void> {
    const dataSource = await getTenantConnection(tenantDbName);
    const userRepo = dataSource.getRepository(User);
    await userRepo.delete(id);
  }
}
