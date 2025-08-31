import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Variant } from './variant.entity';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { Product } from '../products/product.entity';

@Injectable()
export class VariantsService {
  constructor(
    @InjectRepository(Variant) private variants: Repository<Variant>,
    @InjectRepository(Product) private products: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async findAll(params: {
    productId?: string;
    search?: string;
    createdBy?: string;
    sort?: 'ASC' | 'DESC';
  }) {
    const qb = this.variants
      .createQueryBuilder('v')
      .leftJoinAndSelect('v.product', 'p');

    if (params.productId) qb.andWhere('p.id = :pid', { pid: params.productId });
    if (params.createdBy)
      qb.andWhere('v.createdBy = :cb', { cb: params.createdBy });
    if (params.search) {
      const s = `%${params.search}%`;
      qb.andWhere('(v.name ILIKE :s OR v.skuCode ILIKE :s)', { s });
    }

    qb.orderBy('v.index', params.sort ?? 'ASC');
    return qb.getMany();
  }

  async create(dto: CreateVariantDto, createdBy: string) {
    const product = await this.products.findOne({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Parent product not found');

    const count = await this.variants.count({
      where: { product: { id: product.id } },
    });
    const index = count + 1;
    const sku = `${product.index}_${index}`;

    const v = this.variants.create({
      name: dto.name,
      product,
      index,
      skuCode: sku,
      createdBy,
    });

    return this.variants.save(v);
  }

  async update(id: string, dto: UpdateVariantDto) {
    const v = await this.variants.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!v) throw new NotFoundException('Variant not found');

    if (dto.name) v.name = dto.name;

    return this.variants.save(v); // ✅ حفظ التحديثات
  }

  async delete(id: string) {
    const runner = this.dataSource.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();

    try {
      const toDelete = await runner.manager.findOne(Variant, {
        where: { id },
        relations: ['product'],
      });

      if (!toDelete) throw new NotFoundException('Variant not found');

      const productId = toDelete.product.id;

      // Remove variant
      await runner.manager.remove(Variant, toDelete);

      // Reindex all variants of this product
      const variants = await runner.manager.find(Variant, {
        where: { product: { id: productId } },
        order: { index: 'ASC' },
      });

      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        if (v.index !== i + 1) {
          v.index = i + 1;
          await runner.manager.save(Variant, v);
        }
      }

      await runner.commitTransaction();
      return { message: 'Variant deleted successfully' };
    } catch (err) {
      await runner.rollbackTransaction();
      throw err;
    } finally {
      await runner.release();
    }
  }
}
