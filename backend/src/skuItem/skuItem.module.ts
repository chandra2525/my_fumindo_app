import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SkuItemController } from './skuItem.controller';
import { SkuItemService } from './skuItem.service';
import { SkuItem } from './skuItem.model';
import { Category } from '../category/category.model';


@Module({
  imports: [SequelizeModule.forFeature([SkuItem, Category])],
  controllers: [SkuItemController],
  providers: [SkuItemService],
  exports: [SkuItemService],
})
export class SkuItemModule {}
