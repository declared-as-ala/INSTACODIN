import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Variant } from 'variants/variant.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private products: Repository<Product>,
    @InjectRepository(Variant) private variants: Repository<Variant>,
    private dataSource: DataSource,
  ) {}

  async findAll() {
    return this.products.find({ order: { index: 'ASC' } });
  }

  async findOne(id: string) {
    const p = await this.products.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }

  async create(dto: CreateProductDto) {
    const count = await this.products.count();
    const p = this.products.create({ name: dto.name, index: count + 1 });
    return this.products.save(p);
  }

  async update(id: string, dto: UpdateProductDto) {
    const p = await this.findOne(id);
    if (dto.name) p.name = dto.name;
    return this.products.save(p);
  }

  async delete(id: string) {
    const runner = this.dataSource.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      const toDelete = await runner.manager.findOne(Product, { where: { id } });
      if (!toDelete) throw new NotFoundException('Product not found');

      const deletedIndex = toDelete.index;

      // Remove product (variants cascade on remove)
      await runner.manager.remove(Product, toDelete);

      // Reindex all products 1..N in ASC by old index
      const all = await runner.manager.find(Product, {
        order: { index: 'ASC' },
      });
      for (let i = 0; i < all.length; i++) {
        const p = all[i];
        if (p.index !== i + 1) {
          p.index = i + 1;
          await runner.manager.save(Product, p);
        }
      }

      await runner.commitTransaction();
      return { message: 'Product deleted successfully' };
    } catch (err) {
      await runner.rollbackTransaction();
      throw err;
    } finally {
      await runner.release();
    }
  }
}
