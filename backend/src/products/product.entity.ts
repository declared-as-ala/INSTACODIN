import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Variant } from 'variants/variant.entity';

@Entity('products')
@Unique(['index'])
export class Product {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @Column({ type: 'varchar', length: 180 }) name!: string;

  @Column({ type: 'int' }) index!: number; // 1..N continuous

  @OneToMany(() => Variant, (v) => v.product, { cascade: ['remove'] })
  variants!: Variant[];
}
