import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getTenantConnection } from '../database/tenant-connection.manager';

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
    
    const roles = data.roleIds ? await roleRepo.findBy({ role_id: In(data.roleIds) }) : [];
    const hashedPassword = await require('bcryptjs').hash(data.password, 10);
    const user = userRepo.create({ ...data, password: hashedPassword, roles });
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
    if (data.roleIds) {
      user.roles = await roleRepo.findBy({ role_id: In(data.roleIds) });
    }
    if (data.password) {
      data.password = await require('bcryptjs').hash(data.password, 10);
    }
    Object.assign(user, data);
    return userRepo.save(user);
  }

  async remove(id: string, tenantDbName: string): Promise<void> {
    const dataSource = await getTenantConnection(tenantDbName);
    const userRepo = dataSource.getRepository(User);
    await userRepo.delete(id);
  }
}
