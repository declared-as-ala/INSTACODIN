import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';

@Entity('variants')
export class Variant {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @Column({ type: 'varchar', length: 180 }) name!: string;

  @ManyToOne(() => Product, (p) => p.variants, { onDelete: 'CASCADE' })
  product!: Product;

  @Column({ type: 'int' }) index!: number; // 1..M per product

  @Index()
  @Column({ type: 'varchar', length: 32 })
  skuCode!: string; // <productIndex>_<variantIndex>

  @Index()
  @Column({ type: 'varchar', length: 64 })
  createdBy!: string; // username
}
