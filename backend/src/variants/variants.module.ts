import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variant } from './variant.entity';
import { VariantsService } from './variants.service';
import { VariantsController } from './variants.controller';
import { Product } from '../products/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Variant, Product])],
  providers: [VariantsService],
  controllers: [VariantsController],
})
export class VariantsModule {}
