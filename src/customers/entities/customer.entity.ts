import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  customer_id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @Column({ type: 'enum', enum: ['male', 'female', 'other'], nullable: true })
  gender: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  postal_code: string;

  @Column({ nullable: true })
  country: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_spent: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  account_balance: number;

  @Column({ type: 'int', default: 0 })
  total_orders: number;

  @Column({ type: 'enum', enum: ['active', 'inactive', 'blocked'], default: 'active' })
  status: string;

  @Column({ type: 'enum', enum: ['bronze', 'silver', 'gold', 'platinum'], default: 'bronze' })
  loyalty_tier: string;

  @Column({ type: 'int', default: 0 })
  loyalty_points: number;

  @Column({ type: 'date', nullable: true })
  last_visit_date: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'json', nullable: true })
  preferences: any; // Shopping preferences, communication preferences, etc.

  @Column({ type: 'json', nullable: true })
  tags: string[]; // Customer tags for segmentation

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  deleted_at: Date;

  // Virtual field for full name
  get full_name(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  // Virtual field for customer display
  get display_name(): string {
    return this.full_name || this.email;
  }
}