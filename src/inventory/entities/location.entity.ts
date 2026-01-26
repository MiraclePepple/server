import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

export enum LocationType {
  STORE = 'store',
  WAREHOUSE = 'warehouse',
}

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  location_id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: LocationType,
    default: LocationType.STORE,
  })
  type: LocationType;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}