import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Variant } from '../variants/variant.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'test',
  password: process.env.DATABASE_PASSWORD || 'test',
  database: process.env.DATABASE_NAME || 'fullstack_test',
  entities: [User, Product, Variant],
  synchronize: true, // مخصص للتطوير، لتوليد الجداول تلقائياً
  logging: false,
});
