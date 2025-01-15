import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PurchaseInboundItem } from './purchaseInboundItem.model'; 
import { SkuItem } from '../skuItem/skuItem.model'; 
import { Sequelize, Op, QueryTypes } from 'sequelize';
// import { Sequelize } from 'sequelize-typescript'; // Import Sequelize

@Injectable()
export class PurchaseInboundItemService {
  constructor(
    @InjectModel(PurchaseInboundItem)
    private readonly purchaseInboundItemModel: typeof PurchaseInboundItem,
  ) {}


  async findAllPending(
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
    actual_quantity?: string,
    orderBy: string = 'oldest_purchase_inbound_item_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
    page: number = 1,
    pageSize: number = 10,
  // ): Promise<{ rows: PurchaseInboundItem[]; sp: any }> {
  ): Promise<{ rows: PurchaseInboundItem[]; sp: any }> {
    const whereClause: any = {};

    if (purchase_inbound_id) {
      whereClause.purchase_inbound_id = { [Op.eq]: purchase_inbound_id }; 
    }
    
    if (expected_quantity) {
      whereClause.expected_quantity = { [Op.eq]: expected_quantity }; 
    }
    
    if (actual_quantity) {
      // if (actual_quantity === '0') {
        whereClause.actual_quantity = { [Op.eq]: 0 }; // Filter untuk nilai 0
      // } else if (actual_quantity === '>0') {
      //   whereClause.actual_quantity = { [Op.gt]: 0 }; // Filter untuk nilai lebih dari 0
      // } else {
      //   whereClause.actual_quantity = { [Op.eq]: actual_quantity }; // Filter untuk nilai spesifik
      // }
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
            { actual_quantity: { [Op.eq]: Number(search) } },
        ]),
      ];
    }

    // Pagination variables
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
  
    const { rows, count } = await this.purchaseInboundItemModel.findAndCountAll({
      attributes:[
        'purchase_inbound_id',
        [Sequelize.fn('MIN', Sequelize.col('current_price')), 'current_price'], // Ambil ID paling lama
        [Sequelize.fn('MIN', Sequelize.col('expected_quantity')), 'expected_quantity'], // Ambil ID paling lama
        [Sequelize.fn('MIN', Sequelize.col('actual_quantity')), 'actual_quantity'], // Ambil ID paling lama
        [Sequelize.fn('MIN', Sequelize.col('actual_inbound_item_date')), 'actual_inbound_item_date'], // Ambil ID paling lama
        // 'skuItem.sku_item_id',
        // [Sequelize.col('PurchaseInboundItem.sku_item_id'), 'sku_item_id']
        // [Sequelize.col('purchase_inbound_item.sku_item_id'), 'sku_item_id'], // Gunakan alias eksplisit
        [Sequelize.col('skuItem.sku_item_id'), 'sku_item_id'], // Gunakan alias eksplisit
        [Sequelize.fn('MIN', Sequelize.col('purchase_inbound_item_id')), 'oldest_purchase_inbound_item_id'], // Ambil ID paling lama
        [Sequelize.fn('SUM', Sequelize.col('actual_quantity')), 'total_actual_quantity'], // Totalkan actual_quantity
      ],
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
      // group: ['purchase_inbound_id'],
      // group: ['purchase_inbound_id', 'sku_item_id'],
      group: 
        [
          // 'PurchaseInboundItem.purchase_inbound_item_id',
          'PurchaseInboundItem.purchase_inbound_id',
          'skuItem.sku_item_id',
        ],
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
      pageCount: Math.ceil(count.length / pageSize),
      rowCount: count.length,
      start: offset,
      limit,
    };
  
    return { rows, sp };
  }


  async findAllReceived(
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
    actual_quantity?: string,
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
    
    if (actual_quantity) {
      // if (actual_quantity === '0') {
      //   whereClause.actual_quantity = { [Op.eq]: 0 }; // Filter untuk nilai 0
      // } else if (actual_quantity === '>0') {
        whereClause.actual_quantity = { [Op.gt]: 0 }; // Filter untuk nilai lebih dari 0
      // } else {
      //   whereClause.actual_quantity = { [Op.eq]: actual_quantity }; // Filter untuk nilai spesifik
      // }
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
            { actual_quantity: { [Op.eq]: Number(search) } },
        ]),
      ];
    }

    // Pagination variables
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
  
    const query = `
    SELECT 
      pi.purchase_inbound_item_id,
      pi.purchase_inbound_id,
      pi.sku_item_id,
      pi.current_price,
      pi.expected_quantity,
      pi.actual_quantity,
      pi.actual_inbound_item_date,
      SUM(pi.actual_quantity) 
      OVER (PARTITION BY pi.purchase_inbound_id, pi.sku_item_id) AS total_actual_quantity,
      si.consumed,
      si.sku_item_name,
      si.brand,
      si.length,
      si.width,
      si.height,
      si.weight,
      si.price
    FROM purchase_inbound_item AS pi
    LEFT JOIN sku_item AS si ON pi.sku_item_id = si.sku_item_id
    WHERE 1=1
      ${purchase_inbound_id ? `AND pi.purchase_inbound_id = :purchase_inbound_id` : ''}
      ${expected_quantity ? `AND pi.expected_quantity = :expected_quantity` : ''}
      ${actual_quantity ? `AND pi.actual_quantity > 0` : ''}
      ${search ? `AND (si.sku_item_name ILIKE :search OR si.brand ILIKE :search)` : ''}
    ORDER BY ${orderBy} ${orderDirection}
    OFFSET :offset
    LIMIT :limit;
  `;
  
  const replacements: any = {
    purchase_inbound_id,
    expected_quantity,
    actual_quantity,
    search: search ? `%${search}%` : undefined,
    offset,
    limit,
  };
  
  const rows = await this.purchaseInboundItemModel.sequelize.query<PurchaseInboundItem>(query, {
    type: QueryTypes.SELECT,
    replacements,
    logging: console.log, // Log query untuk debugging
  });
  
  const sp = {
    page,
    pageSize,
    pageCount: Math.ceil((rows as unknown as any[]).length / pageSize),
    rowCount: (rows as unknown as any[]).length,
    start: offset,
    limit,
  };
  
  return { rows, sp };
  }


  async findOne(id: number): Promise<PurchaseInboundItem> {
    return this.purchaseInboundItemModel.findByPk(id);
  }


  async updateActualQuantity(purchaseInboundItemId: number, data: any): Promise<void> {
    const { actual_quantity, actual_inbound_item_date } = data;

    const purchaseInboundItem = await this.purchaseInboundItemModel.findByPk(purchaseInboundItemId);
    if (!purchaseInboundItem) {
      throw new NotFoundException('Purchase Inbound Item not found');
    }
    
    await purchaseInboundItem.update({ 
      actual_quantity,
      actual_inbound_item_date
    });
  }


  async remove(id: number): Promise<void> {
    const purchaseInboundItem = await this.findOne(id);
    if (purchaseInboundItem) {
      await purchaseInboundItem.destroy();
    }
  }


  async create(data: any): Promise<void> {
    const { purchase_inbound_id, sku_item_id, current_price, expected_quantity, actual_quantity, actual_inbound_item_date } = data;

    // Insert into purchase_inbound_item table
     await this.purchaseInboundItemModel.create({
      purchase_inbound_id,
      sku_item_id,
      current_price,
      expected_quantity,
      actual_quantity,
      actual_inbound_item_date,
    });

  }
}
