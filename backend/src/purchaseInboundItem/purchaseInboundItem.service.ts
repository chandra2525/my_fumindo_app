import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PurchaseInbound } from '../purchaseInbound/purchaseInbound.model';
import { PurchaseInboundItem } from './purchaseInboundItem.model'; 
import { SkuItem } from '../skuItem/skuItem.model'; 
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class PurchaseInboundItemService {
  constructor(
    @InjectModel(PurchaseInboundItem)
    private readonly purchaseInboundItemModel: typeof PurchaseInboundItem,
    @InjectModel(PurchaseInbound)
    private readonly purchaseInboundModel: typeof PurchaseInbound,
  ) {}


  async findAll(
    purchase_inbound_id?: string,
    consumeds?: string[], 
    sku_item_name?: string,
    brand?: string,
    length?: string,
    width?: string,
    height?: string,
    weight?: string,
    price?: string,
    expected_quantity?: string, 
    orderBy: string = 'purchase_inbound_item_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ rows: PurchaseInboundItem[]; sp: any }> {
    const whereClause: any = {};

    if (purchase_inbound_id) {
      whereClause.purchase_inbound_id = { [Op.eq]: purchase_inbound_id }; 
    }
    
    if (expected_quantity) {
      whereClause.expected_quantity = { [Op.eq]: expected_quantity }; 
    }

    if (search) {
      whereClause[Op.or] = [
        { consumed: { [Op.iLike]: `%${search}%` } },
        { '$skuItem.sku_item_name$': { [Op.iLike]: `%${search}%` } },
        { '$skuItem.brand$': { [Op.iLike]: `%${search}%` } },
        // Gunakan pencarian angka eksak untuk kolom ini
        ...(isNaN(Number(search))
        ? []
        : [ 
            { length: { [Op.eq]: Number(search) } },
            { width: { [Op.eq]: Number(search) } },
            { height: { [Op.eq]: Number(search) } },
            { weight: { [Op.eq]: Number(search) } },
            { price: { [Op.eq]: Number(search) } },
            { expected_quantity: { [Op.eq]: Number(search) } },
        ]),
      ];
    }

    // Pagination variables
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
  
    const { rows, count } = await this.purchaseInboundItemModel.findAndCountAll({
      include: [
        {
          model: SkuItem, // Model SkuItem
          attributes: ['consumed'], // Hanya mengambil consumed
          where: consumeds?.length
          ? { consumed: { [Op.in]: consumeds } } // Filter consumed jika diberikan
          : undefined, // Jika tidak ada filter consumed, jangan tambahkan where
        },
        {
          model: SkuItem, // Model SkuItem
          attributes: ['sku_item_name'], // Hanya mengambil sku_item_name
          where: sku_item_name?.length
          ? { sku_item_name: { [Op.iLike]: `%${sku_item_name}%` } } // Filter sku_item_name jika diberikan
          : undefined, // Jika tidak ada filter sku_item_name, jangan tambahkan where
        },
        {
          model: SkuItem, // Model SkuItem
          attributes: ['brand'], // Hanya mengambil brand
          where: brand?.length
          ? { brand: { [Op.iLike]: `%${brand}%` } } // Filter brand jika diberikan
          : undefined, // Jika tidak ada filter brand, jangan tambahkan where
        },
        {
          model: SkuItem, // Model SkuItem
          attributes: ['length'], // Hanya mengambil length
          where: length?.length
          ? { length: { [Op.eq]: length } } // Filter length jika diberikan
          : undefined, // Jika tidak ada filter length, jangan tambahkan where
        },
        {
          model: SkuItem, // Model SkuItem
          attributes: ['width'], // Hanya mengambil width
          where: width?.length
          ? { width: { [Op.eq]: width } } // Filter width jika diberikan
          : undefined, // Jika tidak ada filter width, jangan tambahkan where
        },
        {
          model: SkuItem, // Model SkuItem
          attributes: ['height'], // Hanya mengambil height
          where: height?.length
          ? { height: { [Op.eq]: height } } // Filter height jika diberikan
          : undefined, // Jika tidak ada filter height, jangan tambahkan where
        },
        {
          model: SkuItem, // Model SkuItem
          attributes: ['weight'], // Hanya mengambil weight
          where: weight?.length
          ? { weight: { [Op.eq]: weight } } // Filter weight jika diberikan
          : undefined, // Jika tidak ada filter weight, jangan tambahkan where
        },
        {
          model: SkuItem, // Model SkuItem
          attributes: ['price'], // Hanya mengambil price
          where: price?.length
          ? { price: { [Op.eq]: price } } // Filter price jika diberikan
          : undefined, // Jika tidak ada filter price, jangan tambahkan where
        },

        
      ],
      where: whereClause,
      order: orderBy === 'consumed' // Cek jika sorting berdasarkan consumed
      ? [[{ model: SkuItem, as: 'skuItem' }, 'consumed', orderDirection]] // Sorting berdasarkan consumed
      : orderBy === 'sku_item_name' // Cek jika sorting berdasarkan sku_item_name
      ? [[{ model: SkuItem, as: 'skuItem' }, 'sku_item_name', orderDirection]] // Sorting berdasarkan sku_item_name
      : orderBy === 'brand' // Cek jika sorting berdasarkan brand
      ? [[{ model: SkuItem, as: 'skuItem' }, 'brand', orderDirection]] // Sorting berdasarkan brand
      : orderBy === 'length' // Cek jika sorting berdasarkan length
      ? [[{ model: SkuItem, as: 'skuItem' }, 'length', orderDirection]] // Sorting berdasarkan length
      : orderBy === 'width' // Cek jika sorting berdasarkan width
      ? [[{ model: SkuItem, as: 'skuItem' }, 'width', orderDirection]] // Sorting berdasarkan width
      : orderBy === 'height' // Cek jika sorting berdasarkan height
      ? [[{ model: SkuItem, as: 'skuItem' }, 'height', orderDirection]] // Sorting berdasarkan height
      : orderBy === 'weight' // Cek jika sorting berdasarkan weight
      ? [[{ model: SkuItem, as: 'skuItem' }, 'weight', orderDirection]] // Sorting berdasarkan weight
      : orderBy === 'price' // Cek jika sorting berdasarkan price
      ? [[{ model: SkuItem, as: 'skuItem' }, 'price', orderDirection]] // Sorting berdasarkan price
      : [[orderBy, orderDirection]], // Sorting default (purchase_inbound_item_id)
      offset,
      limit,
    });

    const sp = {
      page,
      pageSize,
      pageCount: Math.ceil(count / pageSize),
      rowCount: count,
      start: offset,
      limit,
    };
  
    return { rows, sp };
  }

  async findOne(id: number): Promise<PurchaseInboundItem> {
    return this.purchaseInboundItemModel.findByPk(id);
  }

  async remove(id: number): Promise<void> {
    const purchaseInboundItem = await this.findOne(id);
    if (purchaseInboundItem) {
      await purchaseInboundItem.destroy();
    }
  }
}
