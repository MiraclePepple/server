import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  tenant_id: string;

  @Column()
  business_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone_number: string;

  @Column({ nullable: true })
  logo: string;

  @Column()
  currency: string;

  @Column({ nullable: false })
  db_name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  deleted_at: Date;
}