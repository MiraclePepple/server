import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  permission_id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  module: string; // USER_MANAGEMENT, STOCK_ENTRY, POS, INVENTORY, etc.

  @ManyToMany(() => Role, role => role.permissions)
  roles: Role[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}