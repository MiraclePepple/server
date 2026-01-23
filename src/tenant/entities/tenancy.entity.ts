import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  tenant_id: string;

  @Column()
  business_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  domain: string; // e.g., "company1.intellisales.com" or "company1"

  @Column()
  phone_number: string;

  @Column({ nullable: true })
  logo: string; // Logo URL or path

  @Column({ nullable: true })
  currency: string;

  @Column({ unique: true })
  db_name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  deleted_at?: Date;
}