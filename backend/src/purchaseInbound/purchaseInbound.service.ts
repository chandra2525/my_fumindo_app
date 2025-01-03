import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PurchaseInbound } from './purchaseInbound.model';
import { PurchaseInboundItem } from '../purchaseInboundItem/purchaseInboundItem.model';
import { CreatePurchaseInboundDto } from './createPurchaseInbound.dto';
import { Warehouse } from '../warehouse/warehouse.model';
import { Vendor } from '../vendor/vendor.model';
import { User } from '../users/users.model';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class PurchaseInboundService {
  constructor(
    @InjectModel(PurchaseInbound)
    private readonly purchaseInboundModel: typeof PurchaseInbound,
    @InjectModel(PurchaseInboundItem)
    private readonly purchaseInboundItemModel: typeof PurchaseInboundItem,
  ) {}


  async findAll(
    warehouseNames?: string[],
    inventoryTypes?: string[],
    vendorNames?: string[],
    statuses?: string[],
    purchase_order_number?: string,
    username?: string,
    expected_inbound_date?: string,
    asn?: string,
    create_date?: Date,
    orderBy: string = 'purchase_inbound_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ rows: PurchaseInbound[]; sp: any }> {
    const whereClause: any = {};

    if (inventoryTypes?.length) {
      whereClause.inventory_type = { [Op.in]: inventoryTypes };  
    }
    if (purchase_order_number) {
      whereClause.purchase_order_number = { [Op.iLike]: `%${purchase_order_number}%` };  
    }
    if (expected_inbound_date) {
      whereClause.expected_inbound_date = { [Op.iLike]: `%${expected_inbound_date}%` };  
    }
    if (asn) {
      whereClause.asn = { [Op.iLike]: `%${asn}%` };  
    }
    if (statuses?.length) {
      whereClause.status = { [Op.in]: statuses };  
    }
    // if (create_date) {
    //   whereClause.create_date = { [Op.iLike]: `%${create_date}%` };  
    // }
    if (create_date) {
      whereClause[Op.and] = Sequelize.where(
        Sequelize.fn(
          'TO_CHAR',
          Sequelize.col('create_date'),
          `Dy, DD Month YYYY, "Jam" HH24:MI:SS TZ`
        ),
        { [Op.iLike]: `%${create_date}%` }
      );
    }
    if (search) {
      whereClause[Op.or] = [
        { inventory_type: { [Op.iLike]: `%${search}%` } },
        { purchase_order_number: { [Op.iLike]: `%${search}%` } },
        { expected_inbound_date: { [Op.iLike]: `%${search}%` } },
        { asn: { [Op.iLike]: `%${search}%` } },
        { status: { [Op.iLike]: `%${search}%` } },
        // { create_date: { [Op.iLike]: `%${search}%` } },
        Sequelize.where(
          Sequelize.fn(
            'TO_CHAR',
            Sequelize.col('create_date'),
            `Dy, DD Month YYYY, "Jam" HH24:MI:SS TZ`
          ),
          { [Op.iLike]: `%${search}%` }
        ),
        { '$warehouse.warehouse_name$': { [Op.iLike]: `%${search}%` } },
        { '$vendor.vendor_name$': { [Op.iLike]: `%${search}%` } },
        { '$user.username$': { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Pagination variables
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
  
    const { rows, count } = await this.purchaseInboundModel.findAndCountAll({
      include: [
        {
          model: Warehouse, // Model Warehouse
          attributes: ['warehouse_name'], // Hanya mengambil warehouse_name
          where: warehouseNames?.length
          ? { warehouse_name: { [Op.in]: warehouseNames } } // Filter warehouse_name jika diberikan
          : undefined, // Jika tidak ada filter warehouse_name, jangan tambahkan where
        },
        {
          model: Vendor, // Model Vendor
          attributes: ['vendor_name'], // Hanya mengambil vendor_name
          where: vendorNames?.length
          ? { vendor_name: { [Op.in]: vendorNames } } // Filter vendor_name jika diberikan
          : undefined, // Jika tidak ada filter vendor_name, jangan tambahkan where
        },
        {
          model: User, // Model User
          attributes: ['username'], // Hanya mengambil username
          where: username?.length
          ? { username: { [Op.iLike]: `%${username}%` } } // Filter username jika diberikan
          : undefined, // Jika tidak ada filter username, jangan tambahkan where
        },
      ],
      where: whereClause,
      order: orderBy === 'warehouse_name' // Cek jika sorting berdasarkan warehouse_name
      ? [[{ model: Warehouse, as: 'warehouse' }, 'warehouse_name', orderDirection]] // Sorting berdasarkan warehouse_name
      : orderBy === 'vendor_name' // Cek jika sorting berdasarkan vendor_name
      ? [[{ model: Vendor, as: 'vendor' }, 'vendor_name', orderDirection]] // Sorting berdasarkan vendor_name
      : orderBy === 'username' // Cek jika sorting berdasarkan username
      ? [[{ model: User, as: 'user' }, 'username', orderDirection]] // Sorting berdasarkan username
      : [[orderBy, orderDirection]], // Sorting default (purchase_inbound_id)
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

  async findOne(id: number): Promise<PurchaseInbound> {
    return this.purchaseInboundModel.findByPk(id);
  }
  
  async create(data: CreatePurchaseInboundDto): Promise<{ purchaseInbound: PurchaseInbound; items: PurchaseInboundItem[] }> {
    const { sku_item_id, expected_quantity, ...inboundData } = data;

    if (sku_item_id.length !== expected_quantity.length) {
      throw new BadRequestException('sku_item_id dan expected_quantity harus memiliki jumlah yang sama.');
    }

    // Simpan data ke tabel purchase_inbound
    const purchaseInbound = await this.purchaseInboundModel.create(inboundData);

    // Siapkan data untuk tabel purchase_inbound_item
    const items = sku_item_id.map((skuId, index) => ({
      purchase_inbound_id: purchaseInbound.purchase_inbound_id,
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


  async update(purchaseInboundId: number, data: any): Promise<void> {
    const { warehouse_id, vendor_id, user_id, inventory_type, purchase_order_number, expected_inbound_date, asn, status, update_date } = data;

    const purchaseInbound = await this.purchaseInboundModel.findByPk(purchaseInboundId);
    if (!purchaseInbound) {
      throw new NotFoundException('Purchase Inbound not found');
    }
    
    await purchaseInbound.update({ 
      warehouse_id,
      vendor_id,
      user_id,
      inventory_type,
      purchase_order_number,
      expected_inbound_date,
      asn,
      status,
      update_date,
    });
  }

  async remove(id: number): Promise<void> {
    const purchaseInbound = await this.findOne(id);
    if (purchaseInbound) {
      await purchaseInbound.destroy();
    }
  }
}
