import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Stock } from './stock.model'; 
import { SkuItem } from '../skuItem/skuItem.model';
import { Branch } from '../branch/branch.model';
import { Warehouse } from '../warehouse/warehouse.model';
import { PurchaseInboundItem } from '../purchaseInboundItem/purchaseInboundItem.model';
import { Op } from 'sequelize';
import * as ExcelJS from 'exceljs'; 

@Injectable()
export class StockService {
  constructor(
    @InjectModel(Stock)
    private readonly stockModel: typeof Stock,
    @InjectModel(PurchaseInboundItem)
    private readonly purchaseInboundItemModel: typeof PurchaseInboundItem,
  ) {}


  async findAll(
    branchNames?: string[],
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
        { '$branch.branch_name$': { [Op.iLike]: `%${search}%` } },
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
          model: Branch, // Model Branch
          attributes: ['branch_name'], // Hanya mengambil branch_name
          where: branchNames?.length
          ? { branch_name: { [Op.in]: branchNames } } // Filter branch_name jika diberikan
          : undefined, // Jika tidak ada filter branch_name, jangan tambahkan where
        },
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
      order: orderBy === 'branch_name' // Cek jika sorting berdasarkan branch_name
      ? [[{ model: Branch, as: 'branch' }, 'branch_name', orderDirection]] // Sorting berdasarkan branch_name
      : orderBy === 'warehouse_name' // Cek jika sorting berdasarkan warehouse_name
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
    purchaseInboundId: number = 0,
    skuItemId: number,
    branchId: number,
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
      } else if (typeSubmit == 'delete'){
        existingStock.stock_quantity -= quantityBefore;
        await existingStock.save();
        // Hapus data dari tabel purchase_inbound_item sesuai id
        await this.purchaseInboundItemModel.destroy({
          where: [{ purchase_inbound_id: purchaseInboundId }, { sku_item_id: skuItemId }],
        });
      } else {
        // Jika ada, tambahkan stock_quantity
        existingStock.stock_quantity += stockQuantity;
        await existingStock.save();
      }
      return { message: `Stock updated. SKU Item ID ${skuItemId}, Branch ID ${branchId} and Warehouse ID ${warehouseId} now has ${existingStock.stock_quantity} quantity.` };
    } else {
      // Jika tidak ada, buat record baru
      await this.stockModel.create({
        sku_item_id: skuItemId,
        branch_id: branchId,
        warehouse_id: warehouseId,
        stock_quantity: stockQuantity,
      });

      return { message: `Stock created. SKU Item ID ${skuItemId} and Warehouse ID ${warehouseId} added with ${stockQuantity} quantity.` };
    }
  }


  async updateBatchStock(updateDto: any): Promise<any> {
    const { purchase_inbound_id, sku_item_id, total_actual_quantity, warehouse_id } = updateDto;

    // Validate input
    if (
      !Array.isArray(sku_item_id) ||
      !Array.isArray(total_actual_quantity) ||
      sku_item_id.length !== total_actual_quantity.length
    ) {
      throw new BadRequestException('Invalid input data');
    }

    // Loop and update records
    const updates = [];
    for (let i = 0; i < sku_item_id.length; i++) {
      const skuId = sku_item_id[i];
      const actualQuantity = total_actual_quantity[i];

      const existingStock = await this.stockModel.findOne({
        where: [{ sku_item_id: skuId }, { warehouse_id: warehouse_id }],
      });

      // Hapus data dari tabel purchase_inbound_item sesuai id
      // await this.purchaseInboundItemModel.destroy({
      //   where: [{ purchase_inbound_id: purchase_inbound_id }, { sku_item_id: skuId }],
      // });
      
      const [updated] = await this.stockModel.update(
        { stock_quantity: existingStock.stock_quantity - actualQuantity },
        {
          where: {
            sku_item_id: skuId,
            warehouse_id,
          },
        },
      );

      updates.push({ sku_item_id: skuId, updated });
    }

    return { message: 'Batch update completed', updates };
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


  async exportStock(
    branchNames?: string[],
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
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data Stok Item');
  
    // Header Excel
    const headers = [      
      { header: 'No', key: 'no', width: 5 },
      { header: 'Cabang', key: 'branch_name', width: 32 },
      { header: 'Gudang', key: 'warehouse_name', width: 32 },
      { header: 'Nama Item SKU', key: 'sku_item_name', width: 32 },
      { header: 'Jumlah Stok', key: 'stock_quantity', width: 32 },
      { header: 'Merek', key: 'brand', width: 15 },
      { header: 'Panjang', key: 'length', width: 15 },
      { header: 'Lebar', key: 'width', width: 15 },
      { header: 'Tinggi', key: 'height', width: 15 },
      { header: 'Berat', key: 'weight', width: 15 },
      { header: 'SKU Dapat Dikonsumsi', key: 'consumed', width: 15 },
    ];
    worksheet.columns = headers;
  
    // Format header 
    worksheet.getRow(1).font = {
      size: 14,
      bold: true,
    };
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F95454' }, // Warna kuning untuk header
      };
      cell.alignment = { horizontal: 'center' }; // Rata tengah
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  
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
        { '$branch.branch_name$': { [Op.iLike]: `%${search}%` } },
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
    
    // Ambil data SkuItem dari database
    const stocks = await this.stockModel.findAll({
      include: [
        {
          model: Branch, // Model Branch
          attributes: ['branch_name'], // Hanya mengambil branch_name
          where: branchNames?.length
          ? { branch_name: { [Op.in]: branchNames } } // Filter branch_name jika diberikan
          : undefined, // Jika tidak ada filter branch_name, jangan tambahkan where
        },
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
      order: orderBy === 'branch_name' // Cek jika sorting berdasarkan branch_name
      ? [[{ model: Branch, as: 'branch' }, 'branch_name', orderDirection]] // Sorting berdasarkan branch_name
      : orderBy === 'warehouse_name' // Cek jika sorting berdasarkan warehouse_name
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
      attributes: ['stock_id', 'sku_item_id', 'branch_id', 'warehouse_id', 'stock_quantity'], // Kolom yang akan diambil 
    });
  
    // Tambahkan data ke worksheet
    stocks.forEach((stocks, index) => {
      worksheet.addRow({
        no: index + 1,
        branch_name: stocks.branch?.branch_name || '',
        warehouse_name: stocks.warehouse?.warehouse_name || '',
        sku_item_name: stocks.skuItem?.sku_item_name || '',
        stock_quantity: stocks.stock_quantity,
        brand: stocks.skuItem?.brand || '',
        length: stocks.skuItem?.length || '',
        width: stocks.skuItem?.width || '',
        height: stocks.skuItem?.height || '',
        weight: stocks.skuItem?.weight || '',
        consumed: stocks.skuItem?.consumed || '',
      });
    });
  
    // Konversi workbook menjadi buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer;
    return buffer;
  }
}
