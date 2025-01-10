import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { Stock } from './stock.model';
import { SkuItem } from '../skuItem/skuItem.model';


@Module({
  imports: [SequelizeModule.forFeature([Stock, SkuItem])],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
