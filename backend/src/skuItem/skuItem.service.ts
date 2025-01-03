import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SkuItem } from './skuItem.model';
import { SkuType } from '../skuType/skuType.model';
import { AssetUnit } from '../assetUnit/assetUnit.model';
import { Vendor } from '../vendor/vendor.model';
import { Op } from 'sequelize';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs'; 

@Injectable()
export class SkuItemService {
 
  constructor(
    @InjectModel(SkuItem)
    private skuItemModel: typeof SkuItem,
  ) {}

  async findAll(
    skuTypeNames?: string[],
    unitNames?: string[],
    vendorNames?: string[],
    vendorIds?: string[],
    sku_item_name?: string,
    brand?: string,
    // length?: string,
    // width?: string,
    // height?: string,
    // weight?: string,
    // price?: string,
    // consumed?: string,
    consumeds?: string[],
    orderBy: string = 'sku_item_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ rows: SkuItem[]; sp: any }> {
    const whereClause: any = {};

    if (sku_item_name) {
      whereClause.sku_item_name = { [Op.iLike]: `%${sku_item_name}%` };  
    }
    if (brand) {
      whereClause.brand = { [Op.iLike]: `%${brand}%` };  
    }
    // if (length) {
    //   whereClause.length = { [Op.iLike]: `%${length}%` };  
    // }
    // if (width) {
    //   whereClause.width = { [Op.iLike]: `%${width}%` };  
    // }
    // if (height) {
    //   whereClause.height = { [Op.iLike]: `%${height}%` };  
    // }
    // if (weight) {
    //   whereClause.weight = { [Op.iLike]: `%${weight}%` };  
    // }
    // if (price) {
    //   whereClause.price = { [Op.iLike]: `%${price}%` };  
    // }
    // if (consumed) {
    //   whereClause.consumed = { [Op.iLike]: `%${consumed}%` };  
    // }
    if (consumeds?.length) {
      whereClause.consumed = { [Op.in]: consumeds }; // Filter consumed
    }
    if (search) {
      whereClause[Op.or] = [
        { sku_item_name: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } },
        // { length: { [Op.iLike]: `%${search}%` } },
        // { width: { [Op.iLike]: `%${search}%` } },
        // { height: { [Op.iLike]: `%${search}%` } },
        // { weight: { [Op.iLike]: `%${search}%` } },
        // { price: { [Op.iLike]: `%${search}%` } },
        { consumed: { [Op.iLike]: `%${search}%` } },
        { '$skuType.sku_type_name$': { [Op.iLike]: `%${search}%` } },
        { '$assetUnit.unit_name$': { [Op.iLike]: `%${search}%` } },
        { '$vendor.vendor_name$': { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Pagination variables
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
  
    const { rows, count } = await this.skuItemModel.findAndCountAll({
      include: [
        {
          model: SkuType, // Model SkuType
          attributes: ['sku_type_name'], // Hanya mengambil sku_type_name
          where: skuTypeNames?.length
          ? { sku_type_name: { [Op.in]: skuTypeNames } } // Filter sku_type_name jika diberikan
          : undefined, // Jika tidak ada filter sku_type_name, jangan tambahkan where
        },
        {
          model: AssetUnit, // Model AssetUnit
          attributes: ['unit_name'], // Hanya mengambil unit_name
          where: unitNames?.length
          ? { unit_name: { [Op.in]: unitNames } } // Filter unit_name jika diberikan
          : undefined, // Jika tidak ada filter unit_name, jangan tambahkan where
        },
        {
          model: Vendor, // Model Vendor
          attributes: ['vendor_name'], // Hanya mengambil vendor_name
          where: vendorIds?.length
          ? { vendor_id: { [Op.in]: vendorIds } } // Filter vendor_id jika diberikan
          : vendorNames?.length
          ? { vendor_name: { [Op.in]: vendorNames } } // Filter vendor_id jika diberikan
          : undefined, // Jika tidak ada filter vendor_name, jangan tambahkan where
        },
      ],
      where: whereClause,
      order: orderBy === 'sku_type_name' // Cek jika sorting berdasarkan sku_type_name
      ? [[{ model: SkuType, as: 'skuType' }, 'sku_type_name', orderDirection]] // Sorting berdasarkan sku_type_name
      : orderBy === 'unit_name' // Cek jika sorting berdasarkan unit_name
      ? [[{ model: AssetUnit, as: 'assetUnit' }, 'unit_name', orderDirection]] // Sorting berdasarkan unit_name
      : orderBy === 'vendor_name' // Cek jika sorting berdasarkan vendor_name
      ? [[{ model: Vendor, as: 'vendor' }, 'vendor_name', orderDirection]] // Sorting berdasarkan vendor_name
      : [[orderBy, orderDirection]], // Sorting default (sku_item_id)
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


  async findOne(id: number): Promise<SkuItem> {
    return this.skuItemModel.findByPk(id);
  }
 

  async create(data: any): Promise<void> {
    const { sku_type_id, unit_id, vendor_id, sku_item_name, brand, length, width, height, weight, price, consumed } = data;
 
    await this.skuItemModel.create({
      sku_type_id,
      unit_id,
      vendor_id,
      sku_item_name,
      brand,
      length,
      width,
      height,
      weight,
      price,
      consumed,
    });
  
  }
 

  async update(skuItemId: number, data: any): Promise<void> {
    const { sku_type_id, unit_id, vendor_id, sku_item_name, brand, length, width, height, weight, price, consumed } = data;

    const skuItem = await this.skuItemModel.findByPk(skuItemId);
    if (!skuItem) {
      throw new NotFoundException('SkuItem not found');
    }
    
    await skuItem.update({ 
      sku_type_id,
      unit_id,
      vendor_id,
      sku_item_name,
      brand,
      length,
      width,
      height,
      weight,
      price,
      consumed,
    });
  }


  async remove(id: number): Promise<void> {
    const skuItem = await this.findOne(id);
    if (skuItem) {
      await skuItem.destroy();
    }
  }

  async importSkuItems(file: Express.Multer.File): Promise<{ successCount: number; errors: any[] }> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' }); // Membaca file Excel
    const sheetName = workbook.SheetNames[0]; // Ambil sheet pertama
    // Ambil data termasuk header dan Konversi ke JSON
    const rawData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    
    // Ambil header dari baris pertama
    const [headers, ...rows] = rawData;
    // Mapping header file Excel ke sku item variabel database
    const headerMap = {
      'No': null,
      'Jenis SKU': 'sku_type_name',
      'Unit': 'unit_name',
      'Vendor': 'vendor_name',
      'Nama Barang SKU': 'sku_item_name',
      'Merek': 'brand',
      'Panjang': 'length',
      'Lebar': 'width',
      'Tinggi': 'height',
      'Berat': 'weight',
      'Harga': 'price',
      'SKU dapat Dikonsumsi': 'consumed',
    };
     // Bersihkan header yang kosong atau undefined
    const cleanedHeaders = headers.map(header => (header || '').trim());
    const mappedHeaders = cleanedHeaders.map(header => headerMap[header] || null);
    
    // Periksa jika ada header yang tidak dikenali
    const unknownHeaders = cleanedHeaders.filter((_, index) => mappedHeaders[index] === null && headerMap[cleanedHeaders[index]] === undefined);
    if (unknownHeaders.length > 0) {
      throw new BadRequestException(
        `Unknown headers: ${unknownHeaders.join(', ')}. Expected headers are: ${Object.keys(headerMap).join(', ')}`
      );
    }
 
    // Ambil sku_type_name dan sku_type_id dari database
    const skuTypes = await SkuType.findAll();
    const skuTypeMap = skuTypes.reduce((map, skuType) => {
      map[skuType.sku_type_name] = skuType.sku_type_id; // Mapping sku_type_name ke ID
      return map;
    }, {});

    // Ambil unit_name dan unit_id dari database
    const assetUnits = await AssetUnit.findAll();
    const assetUnitMap = assetUnits.reduce((map, assetUnit) => {
      map[assetUnit.unit_name] = assetUnit.unit_id; // Mapping unit_name ke ID
      return map;
    }, {});

    // Ambil vendor_name dan vendor_id dari database
    const vendors = await Vendor.findAll();
    const vendorMap = vendors.reduce((map, vendor) => {
      map[vendor.vendor_name] = vendor.vendor_id; // Mapping vendor_name ke ID
      return map;
    }, {});

    const errors = [];
    let successCount = 0;

    for (const row of rows) {
      const rowData: any = {};
      row.forEach((value, index) => {
        const key = mappedHeaders[index];
        if (key) {
          rowData[key] = value; // Assign nilai berdasarkan mapping header
        }
      });
      try {
        // Konversi sku_type_name menjadi sku_type_id
        if (rowData.sku_type_name) {
          rowData.sku_type_id = skuTypeMap[rowData.sku_type_name];
          if (!rowData.sku_type_id) throw new Error(`Jenis SKU "${rowData.sku_type_name}" tidak ditemukan.`);
        }
        
        // Konversi unit_name menjadi unit_id
        if (rowData.unit_name) {
          rowData.unit_id = skuTypeMap[rowData.unit_name];
          if (!rowData.unit_id) throw new Error(`Jenis SKU "${rowData.unit_name}" tidak ditemukan.`);
        }
        
        // Konversi vendor_name menjadi vendor_id
        if (rowData.vendor_name) {
          rowData.vendor_id = skuTypeMap[rowData.vendor_name];
          if (!rowData.vendor_id) throw new Error(`Jenis SKU "${rowData.vendor_name}" tidak ditemukan.`);
        }

        // Validasi data (sesuaikan dengan model Anda)
        if (!rowData.sku_type_id ||!rowData.unit_id ||!rowData.vendor_id ||!rowData.sku_item_name ||!rowData.consumed) {
          throw new Error('Data tidak valid: kolom "Jenis SKU", "Nama Barang SKU" diperlukan');
        }
  
        // Simpan data ke database
        await this.skuItemModel.create(rowData);
        successCount++;
      } catch (error) { 
        errors.push({ row: rowData, error: error.message });
      }
    }

    return { successCount, errors };
  }

  async generateTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template Data SkuItem');

    // Definisi Header
    const headers = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Jenis SKU', key: 'sku_type_name', width: 32 },
      { header: 'Unit', key: 'unit_name', width: 32 },
      { header: 'Vendor', key: 'vendor_name', width: 32 },
      { header: 'Nama Barang SKU', key: 'sku_item_name', width: 32 },
      { header: 'Merek', key: 'brand', width: 15 },
      { header: 'Panjang', key: 'length', width: 15 },
      { header: 'Lebar', key: 'width', width: 15 },
      { header: 'Tinggi', key: 'height', width: 15 },
      { header: 'Berat', key: 'weight', width: 15 },
      { header: 'Harga', key: 'price', width: 15 },
      { header: 'SKU dapat Dikonsumsi', key: 'consumed', width: 15 },
    ];

    // Tambahkan header ke worksheet
    worksheet.columns = headers;

    // Format header
    worksheet.getRow(1).font = {
      size: 14, // Ukuran font besar
      bold: true, // Tebal
    };

    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F95454' }, // Warna header
      };
      cell.alignment = { horizontal: 'center' }; // Rata tengah
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Tambahkan baris contoh (opsional)
    worksheet.addRow({
      no: 1,
      sku_type_name: 'Isi jenis SKU yang sesuai',
      unit_name: 'Isi unit yang sesuai',
      vendor_name: 'Isi vendor yang sesuai',
      sku_item_name: 'Isi nama jenis SKU, maksimal 100 huruf',
      brand: 'Isi merek, maksimal 100 huruf',
      length: 'Isi panjang, dengan satuan cm',
      width: 'Isi lebar, dengan satuan cm',
      height: 'Isi tinggi, dengan satuan cm',
      weight: 'Isi berat, dengan satuan kg',
      price: 'Isi harga, hanya angka tanpa koma',
      consumed: 'Isi SKU dapat dikonsumsi, dengan pilihan "Iya" atau "Tidak"',
    });

    // Konversi workbook menjadi buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer; // Cast hasil menjadi Buffer
    return buffer;
  }
  
  async exportSkuItems(
    skuTypeNames?: string[],
    unitNames?: string[],
    vendorNames?: string[],
    sku_item_name?: string,
    brand?: string,
    // length?: string,
    // width?: string,
    // height?: string,
    // weight?: string,
    // price?: string,
    // consumed?: string,
    consumeds?: string[],
    orderBy: string = 'sku_item_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data SkuItem');
  
    // Header Excel
    const headers = [      
      { header: 'No', key: 'no', width: 5 },
      { header: 'Jenis SKU', key: 'sku_type_name', width: 32 },
      { header: 'Unit', key: 'unit_name', width: 32 },
      { header: 'Vendor', key: 'vendor_name', width: 32 },
      { header: 'Nama Barang SKU', key: 'sku_item_name', width: 32 },
      { header: 'Merek', key: 'brand', width: 15 },
      { header: 'Panjang', key: 'length', width: 15 },
      { header: 'Lebar', key: 'width', width: 15 },
      { header: 'Tinggi', key: 'height', width: 15 },
      { header: 'Berat', key: 'weight', width: 15 },
      { header: 'Harga', key: 'price', width: 15 },
      { header: 'SKU dapat Dikonsumsi', key: 'consumed', width: 15 },
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
  
    if (sku_item_name) {
      whereClause.sku_item_name = { [Op.iLike]: `%${sku_item_name}%` };  
    }
    if (brand) {
      whereClause.brand = { [Op.iLike]: `%${brand}%` };  
    }
    // if (length) {
    //   whereClause.length = { [Op.iLike]: `%${length}%` };  
    // }
    // if (width) {
    //   whereClause.width = { [Op.iLike]: `%${width}%` };  
    // }
    // if (height) {
    //   whereClause.height = { [Op.iLike]: `%${height}%` };  
    // }
    // if (weight) {
    //   whereClause.weight = { [Op.iLike]: `%${weight}%` };  
    // }
    // if (price) {
    //   whereClause.price = { [Op.iLike]: `%${price}%` };  
    // }
    // if (consumed) {
    //   whereClause.consumed = { [Op.iLike]: `%${consumed}%` };  
    // }
    if (consumeds?.length) {
      whereClause.consumed = { [Op.in]: consumeds }; // Filter consumed
    }
    if (search) {
      whereClause[Op.or] = [
        { sku_item_name: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } },
        // { length: { [Op.iLike]: `%${search}%` } },
        // { width: { [Op.iLike]: `%${search}%` } },
        // { height: { [Op.iLike]: `%${search}%` } },
        // { weight: { [Op.iLike]: `%${search}%` } },
        // { price: { [Op.iLike]: `%${search}%` } },
        { consumed: { [Op.iLike]: `%${search}%` } },
        { '$skuType.sku_type_name$': { [Op.iLike]: `%${search}%` } },
        { '$assetUnit.unit_name$': { [Op.iLike]: `%${search}%` } },
        { '$vendor.vendor_name$': { [Op.iLike]: `%${search}%` } },
      ];
    }
    
    // Ambil data SkuItem dari database
    const skuItems = await this.skuItemModel.findAll({
      include: [
        {
          model: SkuType, // Model SkuType
          attributes: ['sku_type_name'], // Hanya mengambil sku_type_name
          where: skuTypeNames?.length
          ? { sku_type_name: { [Op.in]: skuTypeNames } } // Filter sku_type_name jika diberikan
          : undefined, // Jika tidak ada filter sku_type_name, jangan tambahkan where
        },
        {
          model: AssetUnit, // Model AssetUnit
          attributes: ['unit_name'], // Hanya mengambil unit_name
          where: unitNames?.length
          ? { unit_name: { [Op.in]: unitNames } } // Filter unit_name jika diberikan
          : undefined, // Jika tidak ada filter unit_name, jangan tambahkan where
        },
        {
          model: Vendor, // Model Vendor
          attributes: ['vendor_name'], // Hanya mengambil vendor_name
          where: vendorNames?.length
          ? { vendor_name: { [Op.in]: vendorNames } } // Filter vendor_name jika diberikan
          : undefined, // Jika tidak ada filter vendor_name, jangan tambahkan where
        },
      ],
      where: whereClause,
      order: orderBy === 'sku_type_name' // Cek jika sorting berdasarkan sku_type_name
      ? [[{ model: SkuType, as: 'skuType' }, 'sku_type_name', orderDirection]] // Sorting berdasarkan sku_type_name
      : orderBy === 'unit_name' // Cek jika sorting berdasarkan unit_name
      ? [[{ model: AssetUnit, as: 'assetUnit' }, 'unit_name', orderDirection]] // Sorting berdasarkan unit_name
      : orderBy === 'vendor_name' // Cek jika sorting berdasarkan vendor_name
      ? [[{ model: Vendor, as: 'vendor' }, 'vendor_name', orderDirection]] // Sorting berdasarkan vendor_name
      : [[orderBy, orderDirection]], // Sorting default (sku_item_id)
      attributes: ['sku_type_id', 'unit_id', 'vendor_id', 'sku_item_name', 'brand', 'length', 'width', 'height', 'weight', 'price', 'consumed'], // Kolom yang akan diambil 
    });
  
    // Tambahkan data ke worksheet
    skuItems.forEach((skuItems, index) => {
      worksheet.addRow({
        no: index + 1,
        sku_type_name: skuItems.skuType?.sku_type_name || '', 
        unit_name: skuItems.assetUnit?.unit_name || '', 
        vendor_name: skuItems.vendor?.vendor_name || '', 
        sku_item_name: skuItems.sku_item_name,
        brand: skuItems.brand,
        length: skuItems.length,
        width: skuItems.width,
        height: skuItems.height,
        weight: skuItems.weight,
        price: skuItems.price,
        consumed: skuItems.consumed,
      });
    });
  
    // Konversi workbook menjadi buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer;
    return buffer;
  }
   
}
