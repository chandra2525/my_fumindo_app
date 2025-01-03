import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PurchaseInboundController } from './purchaseInbound.controller';
import { PurchaseInboundService } from './purchaseInbound.service';
import { PurchaseInbound } from './purchaseInbound.model';
import { Warehouse } from '../warehouse/warehouse.model';
import { Vendor } from '../vendor/vendor.model';
import { User } from '../users/users.model';
import { SkuItem } from '../skuItem/skuItem.model';
import { PurchaseInboundItem } from '../purchaseInboundItem/purchaseInboundItem.model';


@Module({
  imports: [SequelizeModule.forFeature([PurchaseInbound, Warehouse, Vendor, User, SkuItem, PurchaseInboundItem])],
  controllers: [PurchaseInboundController],
  providers: [PurchaseInboundService],
  exports: [PurchaseInboundService],
})
export class PurchaseInboundModule {}
