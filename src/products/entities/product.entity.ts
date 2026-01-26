import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProductCategory } from './category.entity';
import { ProductType } from '../dto/create-product.dto';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  product_id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  sku?: string;

  @Column({ nullable: true })
  barcode?: string;

  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.INVENTORY,
  })
  type: ProductType;

  @Column('float')
  price: number;

  @Column({ default: false })
  is_composite: boolean;


  @Column({ nullable: true })
  image_url?: string;

  @ManyToOne(() => ProductCategory, category => category.products, { nullable: true })
  category?: ProductCategory;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
