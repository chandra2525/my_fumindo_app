import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PurchaseInboundItemController } from './purchaseInboundItem.controller';
import { PurchaseInboundItemService } from './purchaseInboundItem.service';
import { PurchaseInboundItem } from './purchaseInboundItem.model';
import { SkuItem } from '../skuItem/skuItem.model';
import { PurchaseInbound } from 'src/purchaseInbound/purchaseInbound.model';


@Module({
  imports: [SequelizeModule.forFeature([PurchaseInboundItem, SkuItem, PurchaseInbound])],
  controllers: [PurchaseInboundItemController],
  providers: [PurchaseInboundItemService],
  exports: [PurchaseInboundItemService],
})
export class PurchaseInboundItemModule {}
