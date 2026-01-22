import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: [
        { username: usernameOrEmail },
        { email: usernameOrEmail },
      ],
      relations: ['roles'],
    });
  }

  async create(data: CreateUserDto): Promise<User> {
    const roles = data.roleIds ? await this.roleRepo.findBy({ role_id: In(data.roleIds) }) : [];
    const hashedPassword = await require('bcryptjs').hash(data.password, 10);
    const user = this.userRepo.create({ ...data, password: hashedPassword, roles });
    return this.userRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find({ relations: ['roles'] });
  }

  async findOne(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { user_id: id }, relations: ['roles'] });
  }

  async update(id: string, data: UpdateUserDto): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { user_id: id }, relations: ['roles'] });
    if (!user) return null;
    if (data.roleIds) {
      user.roles = await this.roleRepo.findBy({ role_id: In(data.roleIds) });
    }
    if (data.password) {
      data.password = await require('bcryptjs').hash(data.password, 10);
    }
    Object.assign(user, data);
    return this.userRepo.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.userRepo.delete(id);
  }
}
