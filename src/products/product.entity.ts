import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  product_id: string;

  @Column()
  name: string;

  @Column()
  sku: string;

  @Column({ nullable: true })
  barcode: string;

  @Column()
  type: 'SERVICE' | 'INVENTORY';

  @Column('decimal')
  price: number;

  @Column({ default: false })
  is_composite: boolean;

  @Column({ nullable: true })
  image_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
