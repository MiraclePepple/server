import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemAdmin } from '../entities/system-admin.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SystemAdminService {
  constructor(
    @InjectRepository(SystemAdmin)
    private readonly systemAdminRepo: Repository<SystemAdmin>,
  ) {}

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<SystemAdmin | null> {
    return this.systemAdminRepo.findOne({
      where: [
        { username: usernameOrEmail },
        { email: usernameOrEmail },
      ],
    });
  }

  async createSystemAdmin(data: {
    username: string;
    email: string;
    password: string;
    full_name: string;
  }): Promise<SystemAdmin> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const admin = this.systemAdminRepo.create({
      ...data,
      password: hashedPassword,
    });
    return this.systemAdminRepo.save(admin);
  }

  async findAll(): Promise<SystemAdmin[]> {
    return this.systemAdminRepo.find({
      select: ['admin_id', 'username', 'email', 'full_name', 'is_active', 'created_at']
    });
  }
}