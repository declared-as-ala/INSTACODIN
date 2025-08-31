// backend/src/variants/variants.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { CurrentUser } from '../common/decorators/user.decorator';

@ApiTags('variants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('variants')
export class VariantsController {
  constructor(private service: VariantsService) {}

  @Get()
  @ApiQuery({ name: 'productId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'createdBy', required: false })
  @ApiQuery({ name: 'sort', required: false, enum: ['ASC', 'DESC'] })
  findAll(
    @Query('productId') productId?: string,
    @Query('search') search?: string,
    @Query('createdBy') createdBy?: string,
    @Query('sort') sort?: 'ASC' | 'DESC',
  ) {
    return this.service.findAll({ productId, search, createdBy, sort });
  }

  @Post()
  create(@Body() dto: CreateVariantDto, @CurrentUser() user?: any) {
    const username = user?.username || 'system';
    return this.service.create(dto, username);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVariantDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
