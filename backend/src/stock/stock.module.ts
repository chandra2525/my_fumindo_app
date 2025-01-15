import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { Stock } from './stock.model';
import { SkuItem } from '../skuItem/skuItem.model';
import { PurchaseInboundItem } from '../purchaseInboundItem/purchaseInboundItem.model';


@Module({
  imports: [SequelizeModule.forFeature([Stock, SkuItem, PurchaseInboundItem])],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
