import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Stock } from './stock.model'; 
import { SkuItem } from '../skuItem/skuItem.model'; 
import { Warehouse } from '../warehouse/warehouse.model';
import { Op } from 'sequelize';

@Injectable()
export class StockService {
  constructor(
    @InjectModel(Stock)
    private readonly stockModel: typeof Stock,
  ) {}


  async findAll(
    warehouseNames?: string[],
    stock_quantity?: string,
    consumeds?: string[], 
    sku_item_name?: string,
    brand?: string,
    length?: string,
    width?: string,
    height?: string,
    weight?: string,
    orderBy: string = 'stock_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ rows: Stock[]; sp: any }> {
    const whereClause: any = {};

    if (stock_quantity) {
      whereClause.stock_quantity = { [Op.eq]: stock_quantity }; 
    }

    if (stock_quantity) {
      whereClause.stock_quantity = { [Op.eq]: stock_quantity }; 
    }

    if (search) {
      whereClause[Op.or] = [
        { '$skuItem.consumed$': { [Op.iLike]: `%${search}%` } },
        { '$skuItem.sku_item_name$': { [Op.iLike]: `%${search}%` } },
        { '$skuItem.brand$': { [Op.iLike]: `%${search}%` } },
        { '$warehouse.warehouse_name$': { [Op.iLike]: `%${search}%` } },
        // Gunakan pencarian angka eksak untuk kolom ini
        ...(isNaN(Number(search))
        ? []
        : [ 
            { '$skuItem.length$': { [Op.eq]: search } },
            { '$skuItem.width$': { [Op.eq]: search } },
            { '$skuItem.height$': { [Op.eq]: search } },
            { '$skuItem.weight$': { [Op.eq]: search } },
            { stock_quantity: { [Op.eq]: search } },
        ]),
      ];
    }

    // Pagination variables
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
  
    const { rows, count } = await this.stockModel.findAndCountAll({
      include: [
        {
          model: Warehouse, // Model Warehouse
          attributes: ['warehouse_name'], // Hanya mengambil warehouse_name
          where: warehouseNames?.length
          ? { warehouse_name: { [Op.in]: warehouseNames } } // Filter warehouse_name jika diberikan
          : undefined, // Jika tidak ada filter warehouse_name, jangan tambahkan where
        },
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
      ],
      where: whereClause,
      order: orderBy === 'warehouse_name' // Cek jika sorting berdasarkan warehouse_name
      ? [[{ model: Warehouse, as: 'warehouse' }, 'warehouse_name', orderDirection]] // Sorting berdasarkan warehouse_name
      : orderBy === 'consumed' // Cek jika sorting berdasarkan consumed
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
      : [[orderBy, orderDirection]], // Sorting default (stock_id)
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


  async addOrUpdateStock(
    skuItemId: number,
    warehouseId: number,
    stockQuantity: number,
    quantityBefore: number,
    typeSubmit: string
  ): Promise<{ message: string }> {
    // Cari apakah sku_item_id sudah ada di tabel stock
    const existingStock = await this.stockModel.findOne({
      where: [{ sku_item_id: skuItemId }, { warehouse_id: warehouseId }],
    });

    // const existingWarehouse = await this.stockModel.findOne({
    //   where: { warehouse_id: warehouseId },
    // });

    if (existingStock) {
      if(typeSubmit == 'update'){
        existingStock.stock_quantity -= quantityBefore;
        existingStock.stock_quantity += stockQuantity;
        await existingStock.save();
      }else{
        // Jika ada, tambahkan stock_quantity
        existingStock.stock_quantity += stockQuantity;
        await existingStock.save();
      }
      return { message: `Stock updated. SKU Item ID ${skuItemId} and Warehouse ID ${warehouseId} now has ${existingStock.stock_quantity} quantity.` };
    } else {
      // Jika tidak ada, buat record baru
      await this.stockModel.create({
        sku_item_id: skuItemId,
        warehouse_id: warehouseId,
        stock_quantity: stockQuantity,
      });

      return { message: `Stock created. SKU Item ID ${skuItemId} and Warehouse ID ${warehouseId} added with ${stockQuantity} quantity.` };
    }
  }


  async remove(
    skuItemId: number,
    warehouseId: number,
  ): Promise<{ message: string }> {
    const skuItem = await this.stockModel.findOne({
      where: { sku_item_id: skuItemId, warehouse_id: warehouseId },
    });
    await skuItem.destroy();
    return { message: `Data Stock deleted. Where SKU Item ID ${skuItemId} and Warehouse ID ${warehouseId}.` };
  }

}
