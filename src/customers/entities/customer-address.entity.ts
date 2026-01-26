import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from './customer.entity';

@Entity('customer_addresses')
export class CustomerAddress {
  @PrimaryGeneratedColumn('uuid')
  address_id: string;

  @Column({ type: 'uuid' })
  customer_id: string;

  @ManyToOne(() => Customer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ type: 'enum', enum: ['home', 'work', 'billing', 'shipping', 'other'], default: 'home' })
  address_type: string;

  @Column()
  label: string; // e.g., "Home Address", "Office", "Mom's House"

  @Column({ type: 'text' })
  address_line_1: string;

  @Column({ type: 'text', nullable: true })
  address_line_2: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postal_code: string;

  @Column()
  country: string;

  @Column({ type: 'boolean', default: false })
  is_default: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Virtual field for formatted address
  get formatted_address(): string {
    const line1 = this.address_line_1;
    const line2 = this.address_line_2 ? `, ${this.address_line_2}` : '';
    const cityState = `${this.city}, ${this.state} ${this.postal_code}`;
    return `${line1}${line2}, ${cityState}, ${this.country}`;
  }
}