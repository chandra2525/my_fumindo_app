import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SkuType } from './skuType.model'; 
import { Category } from '../category/category.model'; 
import { Op } from 'sequelize';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs'; 

@Injectable()
export class SkuTypeService {
 
  constructor(
    @InjectModel(SkuType)
    private skuTypeModel: typeof SkuType,
  ) {}

  async findAll(
    categoryNames?: string[],
    sku_type_name?: string,
    sku_type_code?: string,
    orderBy: string = 'sku_type_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ rows: SkuType[]; sp: any }> {
    const whereClause: any = {};

    if (sku_type_name) {
      whereClause.sku_type_name = { [Op.iLike]: `%${sku_type_name}%` };  
    }
    if (sku_type_code) {
      whereClause.sku_type_code = { [Op.iLike]: `%${sku_type_code}%` };  
    } 
    if (search) {
      whereClause[Op.or] = [
        { sku_type_name: { [Op.iLike]: `%${search}%` } },
        { sku_type_code: { [Op.iLike]: `%${search}%` } }, 
        { '$category.category_name$': { [Op.iLike]: `%${search}%` } }, 
      ];
    }

    // Pagination variables
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
  
    const { rows, count } = await this.skuTypeModel.findAndCountAll({
      include: [
        {
          model: Category, // Model Category
          attributes: ['category_name'], // Hanya mengambil kategori
          where: categoryNames?.length
          ? { category_name: { [Op.in]: categoryNames } } // Filter category_name jika diberikan
          : undefined, // Jika tidak ada filter category_name, jangan tambahkan where
        },
      ],
      where: whereClause, 
      order: orderBy === 'category_name' // Cek jika sorting berdasarkan category_name
      ? [[{ model: Category, as: 'category' }, 'category_name', orderDirection]] // Sorting berdasarkan category_name
      : [[orderBy, orderDirection]], // Sorting default (sku_type_id)
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


  async findOne(id: number): Promise<SkuType> {
    return this.skuTypeModel.findByPk(id);
  }
 

  async create(data: any): Promise<void> {
    const { category_id, sku_type_name, sku_type_code } = data;
 
    await this.skuTypeModel.create({
      category_id,
      sku_type_name, 
      sku_type_code, 
    });
  
  }
 

  async update(skuTypeId: number, data: any): Promise<void> {
    const { category_id, sku_type_name, sku_type_code } = data;

    const skuType = await this.skuTypeModel.findByPk(skuTypeId);
    if (!skuType) {
      throw new NotFoundException('SkuType not found');
    }
    
    await skuType.update({ 
      category_id,
      sku_type_name, 
      sku_type_code,
    });
  }


  async remove(id: number): Promise<void> {
    const skuType = await this.findOne(id);
    if (skuType) {
      await skuType.destroy();
    }
  }

  async importSkuTypes(file: Express.Multer.File): Promise<{ successCount: number; errors: any[] }> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' }); // Membaca file Excel
    const sheetName = workbook.SheetNames[0]; // Ambil sheet pertama
    // Ambil data termasuk header dan Konversi ke JSON
    const rawData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    
    // Ambil header dari baris pertama
    const [headers, ...rows] = rawData;
    // Mapping header file Excel ke kategori variabel database
    const headerMap = {
      'No': null,
      'Kategori': 'category_name',
      'Nama Jenis SKU': 'sku_type_name', 
      'Kode Jenis SKU': 'sku_type_code', 
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
 
    // Ambil category_name dan category_id dari database
    const categories = await Category.findAll();
    const categoryMap = categories.reduce((map, category) => {
      map[category.category_name] = category.category_id; // Mapping kategori ke ID
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
        // Konversi category_name menjadi category_id
        if (rowData.category_name) {
          rowData.category_id = categoryMap[rowData.category_name];
          if (!rowData.category_id) throw new Error(`Kategori "${rowData.category_name}" tidak ditemukan.`);
        }

        // Validasi data (sesuaikan dengan model Anda)
        if (!rowData.category_id ||!rowData.sku_type_name) {
          throw new Error('Data tidak valid: kolom "Kategori", "Nama Jenis SKU" diperlukan');
        }
  
        // Simpan data ke database
        await this.skuTypeModel.create(rowData);
        successCount++;
      } catch (error) { 
        errors.push({ row: rowData, error: error.message });
      }
    }

    return { successCount, errors };
  }

  async generateTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template Data SkuType');

    // Definisi Header
    const headers = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Kategori', key: 'category_name', width: 32 },
      { header: 'Nama Jenis SKU', key: 'sku_type_name', width: 32 },
      { header: 'Kode Jenis SKU', key: 'sku_type_code', width: 53 }, 
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
      category_name: 'Isi kategori yang sesuai',
      sku_type_name: 'Isi nama jenis SKU, maksimal 150 huruf', 
      sku_type_code: 'Isi kode jenis SKU, maksimal 50 huruf', 
    });

    // Konversi workbook menjadi buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer; // Cast hasil menjadi Buffer
    return buffer;
  }
  
  async exportSkuTypes(
    categoryNames?: string[],
    sku_type_name?: string,
    sku_type_code?: string,
    orderBy: string = 'sku_type_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data SkuType');
  
    // Header Excel
    const headers = [      
      { header: 'No', key: 'no', width: 5 },
      { header: 'Kategori', key: 'category_name', width: 32 },
      { header: 'Nama Jenis SKU', key: 'sku_type_name', width: 32 },
      { header: 'Kode Jenis SKU', key: 'sku_type_code', width: 32 },  
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
  
    if (sku_type_name) {
      whereClause.sku_type_name = { [Op.iLike]: `%${sku_type_name}%` };  
    }
    if (sku_type_code) {
      whereClause.sku_type_code = { [Op.iLike]: `%${sku_type_code}%` };  
    } 
    if (search) {
      whereClause[Op.or] = [
        { sku_type_name: { [Op.iLike]: `%${search}%` } },
        { sku_type_code: { [Op.iLike]: `%${search}%` } }, 
        { '$category.category_name$': { [Op.iLike]: `%${search}%` } }, 
      ];
    }
    
    // Ambil data SkuType dari database
    const skuTypes = await this.skuTypeModel.findAll({
      include: [
        {
          model: Category, // Model Category
          attributes: ['category_name'], // Hanya mengambil kategori
          where: categoryNames?.length
          ? { category_name: { [Op.in]: categoryNames } } // Filter category_name jika diberikan
          : undefined, // Jika tidak ada filter category_name, jangan tambahkan where
        },
      ],
      where: whereClause, 
      order: orderBy === 'category_name' // Cek jika sorting berdasarkan category_name
      ? [[{ model: Category, as: 'category' }, 'category_name', orderDirection]] // Sorting berdasarkan category_name
      : [[orderBy, orderDirection]], // Sorting default (sku_type_id)
      attributes: ['category_id', 'sku_type_name', 'sku_type_code'], // Kolom yang akan diambil 
    });
  
    // Tambahkan data ke worksheet
    skuTypes.forEach((skuTypes, index) => {
      worksheet.addRow({
        no: index + 1,
        category_name: skuTypes.category?.category_name || '', 
        sku_type_name: skuTypes.sku_type_name, 
        sku_type_code: skuTypes.sku_type_code, 
      });
    });
  
    // Konversi workbook menjadi buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer;
    return buffer;
  }
   
}
