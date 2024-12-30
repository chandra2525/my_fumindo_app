import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PurchaseInbound } from './purchaseInbound.model';
import { PurchaseInboundItem } from './purchaseInboundItem.model';
import { CreatePurchaseInboundDto } from './createPurchaseInbound.dto';

@Injectable()
export class PurchaseInboundService {
  constructor(
    @InjectModel(PurchaseInbound)
    private readonly purchaseInboundModel: typeof PurchaseInbound,
    @InjectModel(PurchaseInboundItem)
    private readonly purchaseInboundItemModel: typeof PurchaseInboundItem,
  ) {}

  async createPurchaseInbound(data: CreatePurchaseInboundDto): Promise<{ purchaseInbound: PurchaseInbound; items: PurchaseInboundItem[] }> {
    const { sku_item_id, expected_quantity, ...inboundData } = data;

    if (sku_item_id.length !== expected_quantity.length) {
      throw new BadRequestException('sku_item_id dan expected_quantity harus memiliki jumlah yang sama.');
    }

    // Simpan data ke tabel purchase_inbound
    const purchaseInbound = await this.purchaseInboundModel.create(inboundData);

    // Siapkan data untuk tabel purchase_inbound_item
    const items = sku_item_id.map((skuId, index) => ({
      purchase_inbound_id: purchaseInbound.id,
      sku_item_id: skuId,
      expected_quantity: expected_quantity[index],
    }));

    // Simpan data ke tabel purchase_inbound_item
    const purchaseInboundItems = await this.purchaseInboundItemModel.bulkCreate(items);

    return { purchaseInbound, items: purchaseInboundItems };
  }
  
  // async createPurchaseInbound(data: CreatePurchaseInboundDto): Promise<PurchaseInbound[]> {
  //   const { sku_item_id, expected_quantity, ...commonData } = data;

  //   if (sku_item_id.length !== expected_quantity.length) {
  //     throw new BadRequestException('Sku_item_id dan expected_quantity harus memiliki jumlah yang sama.');
  //   }

  //   const purchaseInbounds = sku_item_id.map((skuId, index) => ({
  //     ...commonData,
  //     sku_item_id: skuId,
  //     expected_quantity: expected_quantity[index],
  //   }));

  //   return await this.purchaseInboundModel.bulkCreate(purchaseInbounds);
  // }
}
