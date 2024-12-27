import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SkuTypeController } from './skuType.controller';
import { SkuTypeService } from './skuType.service';
import { SkuType } from './skuType.model';
import { Category } from '../category/category.model';


@Module({
  imports: [SequelizeModule.forFeature([SkuType, Category])],
  controllers: [SkuTypeController],
  providers: [SkuTypeService],
  exports: [SkuTypeService],
})
export class SkuTypeModule {}
