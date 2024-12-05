import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AssetUnit} from './assetUnit.model'; 
import { Op } from 'sequelize';  
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs'; 

@Injectable()
export class AssetUnitService {
  constructor(
    @InjectModel(AssetUnit) private readonly assetUnitModel: typeof AssetUnit) {}

  async findAll( 
    unit_name?: string,
    orderBy: string = 'unit_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ rows: AssetUnit[]; sp: any }> {
    const whereClause: any = {};
  
    if (unit_name) {
      whereClause.unit_name = { [Op.iLike]: `%${unit_name}%` };  
    }

    if (search) {
      whereClause[Op.or] = [
        { unit_name: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Pagination variables
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
  
    const { rows, count } = await this.assetUnitModel.findAndCountAll({
      where: whereClause,
      order: [[orderBy, orderDirection]],
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
  
  async findOne(id: number): Promise<AssetUnit> {
    return this.assetUnitModel.findByPk(id);
  }

  async create(assetUnit: AssetUnit): Promise<AssetUnit> {
    return this.assetUnitModel.create(assetUnit);
  }

  async update(id: number, data): Promise<[number, AssetUnit[]]> {
    return await this.assetUnitModel.update(data, {
      where: { unit_id: id },
      returning: true, // Menambahkan opsi ini untuk mengembalikan data yang diperbarui
    });
  }

  async remove(id: number): Promise<void> {
    const assetUnit = await this.findOne(id);
    if (assetUnit) {
      await assetUnit.destroy();
    }
  }

  async importAssetUnits(file: Express.Multer.File): Promise<{ successCount: number; errors: any[] }> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' }); // Membaca file Excel
    const sheetName = workbook.SheetNames[0]; // Ambil sheet pertama
    // Ambil data termasuk header dan Konversi ke JSON
    const rawData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    
    // Ambil header dari baris pertama
    const [headers, ...rows] = rawData;
    // Mapping header file Excel ke nama variabel database
    const headerMap = {
      'No': null, 
      'Nama Satuan': 'unit_name',
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
        if (!rowData.unit_name) {
          throw new Error('Data tidak valid: kolom "Nama Satuan" diperlukan');
        }
 
        // Simpan data ke database
        await this.assetUnitModel.create(rowData);
        successCount++;
      } catch (error) { 
        errors.push({ row: rowData, error: error.message });
      }
    }

    return { successCount, errors };
  }

  async generateTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template Data Nama Satuan');

    // Definisi Header
    const headers = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Nama Satuan', key: 'unit_name', width: 40 },
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
      unit_name: 'Isi nama satuan, maksimal 50 huruf', 
    });

    // Konversi workbook menjadi buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer; // Cast hasil menjadi Buffer
    return buffer;
  }
  
  
  async exportAssetUnits(
    unit_name?: string,
    orderBy: string = 'unit_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string, 
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data Nama Satuan');
  
    // Header Excel
    const headers = [       
      { header: 'No', key: 'no', width: 5 }, 
      { header: 'Nama Satuan', key: 'unit_name', width: 40 },
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
  
    if (unit_name) {
      whereClause.unit_name = { [Op.iLike]: `%${unit_name}%` };  
    }

    if (search) {
      whereClause[Op.or] = [
        { unit_name: { [Op.iLike]: `%${search}%` } },
      ];
    }
    
    // Ambil data aset dari database
    const assetUnit = await this.assetUnitModel.findAll({
      where: whereClause,
      order: [[orderBy, orderDirection]],
      attributes: ['unit_name'], // Kolom yang akan diambil 
    });
  
    // Tambahkan data ke worksheet
    assetUnit.forEach((assetUnit, index) => {
      worksheet.addRow({
        no: index + 1, 
        unit_name: assetUnit.unit_name,
      });
    });
  
    // Konversi workbook menjadi buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer;
    return buffer;
  }
}
