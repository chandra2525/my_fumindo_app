import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Warehouse } from './warehouse.model'; 
import { Branch } from '../branch/branch.model'; 
import { Op } from 'sequelize';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs'; 

@Injectable()
export class WarehouseService {
 
  constructor(
    @InjectModel(Warehouse)
    private warehouseModel: typeof Warehouse,
  ) {}

  async findAll(
    branchNames?: string[],
    warehouse_name?: string,
    address?: string,
    orderBy: string = 'warehouse_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ rows: Warehouse[]; sp: any }> {
    const whereClause: any = {};

    if (warehouse_name) {
      whereClause.warehouse_name = { [Op.iLike]: `%${warehouse_name}%` };  
    }
    if (address) {
      whereClause.address = { [Op.iLike]: `%${address}%` };  
    } 
    if (search) {
      whereClause[Op.or] = [
        { warehouse_name: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } }, 
        { '$branch.branch_name$': { [Op.iLike]: `%${search}%` } }, 
      ];
    }

    // Pagination variables
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
  
    const { rows, count } = await this.warehouseModel.findAndCountAll({
      include: [
        {
          model: Branch, // Model branch
          attributes: ['branch_name'], // Hanya mengambil nama
          where: branchNames?.length
          ? { branch_name: { [Op.in]: branchNames } } // Filter branch_name jika diberikan
          : undefined, // Jika tidak ada filter branch_name, jangan tambahkan where
        },
      ],
      where: whereClause, 
      order: orderBy === 'branch_name' // Cek jika sorting berdasarkan branch_name
      ? [[{ model: Branch, as: 'branch' }, 'branch_name', orderDirection]] // Sorting berdasarkan branch_name
      : [[orderBy, orderDirection]], // Sorting default (warehouse_id)
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


  async findOne(id: number): Promise<Warehouse> {
    return this.warehouseModel.findByPk(id);
  }
 

  async create(data: any): Promise<void> {
    const { branch_id, warehouse_name, address } = data;
 
    await this.warehouseModel.create({
      branch_id,
      warehouse_name, 
      address, 
    });
  
  }
 

  async update(warehouseId: number, data: any): Promise<void> {
    const { branch_id, warehouse_name, address } = data;

    const warehouse = await this.warehouseModel.findByPk(warehouseId);
    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }
    
    await warehouse.update({ 
      branch_id,
      warehouse_name, 
      address,
    });
  }


  async remove(id: number): Promise<void> {
    const warehouse = await this.findOne(id);
    if (warehouse) {
      await warehouse.destroy();
    }
  }

  async importWarehouses(file: Express.Multer.File): Promise<{ successCount: number; errors: any[] }> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' }); // Membaca file Excel
    const sheetName = workbook.SheetNames[0]; // Ambil sheet pertama
    // Ambil data termasuk header dan Konversi ke JSON
    const rawData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    
    // Ambil header dari baris pertama
    const [headers, ...rows] = rawData;
    // Mapping header file Excel ke nama variabel database
    const headerMap = {
      'No': null,
      'Nama Cabang': 'branch_name',
      'Nama Gudang': 'warehouse_name', 
      'Alamat': 'address', 
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
 
    // Ambil branch_name dan branch_id dari database
    const branches = await Branch.findAll();
    const branchMap = branches.reduce((map, branch) => {
      map[branch.branch_name] = branch.branch_id; // Mapping nama ke ID
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
        // Konversi branch_name menjadi branch_id
        if (rowData.branch_name) {
          rowData.branch_id = branchMap[rowData.branch_name];
          if (!rowData.branch_id) throw new Error(`Cabang "${rowData.branch_name}" tidak ditemukan.`);
        }

        // Validasi data (sesuaikan dengan model Anda)
        if (!rowData.branch_id ||!rowData.warehouse_name) {
          throw new Error('Data tidak valid: kolom "Nama Cabang", "Nama Gudang" diperlukan');
        }
  
        // Simpan data ke database
        await this.warehouseModel.create(rowData);
        successCount++;
      } catch (error) { 
        errors.push({ row: rowData, error: error.message });
      }
    }

    return { successCount, errors };
  }

  async generateTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template Data Warehouse');

    // Definisi Header
    const headers = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Nama Cabang', key: 'branch_name', width: 25 },
      { header: 'Nama Gudang', key: 'warehouse_name', width: 32 },
      { header: 'Alamat', key: 'address', width: 53 }, 
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
      branch_name: 'Isi nama cabang yang sesuai',
      warehouse_name: 'Isi nama gudang, maksimal 30 huruf', 
      address: 'Isi alamat gudang',
    });

    // Konversi workbook menjadi buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer; // Cast hasil menjadi Buffer
    return buffer;
  }
  
  async exportWarehouses(
    branchNames?: string[],
    warehouse_name?: string,
    address?: string,
    orderBy: string = 'warehouse_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data Warehouse');
  
    // Header Excel
    const headers = [      
      { header: 'No', key: 'no', width: 5 },
      { header: 'Nama Cabang', key: 'branch_name', width: 25 },
      { header: 'Nama Gudang', key: 'warehouse_name', width: 32 },
      { header: 'Alamat', key: 'address', width: 32 },  
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
  
    if (warehouse_name) {
      whereClause.warehouse_name = { [Op.iLike]: `%${warehouse_name}%` };  
    }
    if (address) {
      whereClause.address = { [Op.iLike]: `%${address}%` };  
    } 
    if (search) {
      whereClause[Op.or] = [
        { warehouse_name: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } }, 
        { '$branch.branch_name$': { [Op.iLike]: `%${search}%` } }, 
      ];
    }
    
    // Ambil data Warehouse dari database
    const warehouses = await this.warehouseModel.findAll({
      include: [
        {
          model: Branch, // Model branch
          attributes: ['branch_name'], // Hanya mengambil nama
          where: branchNames?.length
          ? { branch_name: { [Op.in]: branchNames } } // Filter branch_name jika diberikan
          : undefined, // Jika tidak ada filter branch_name, jangan tambahkan where
        },
      ],
      where: whereClause, 
      order: orderBy === 'branch_name' // Cek jika sorting berdasarkan branch_name
      ? [[{ model: Branch, as: 'branch' }, 'branch_name', orderDirection]] // Sorting berdasarkan branch_name
      : [[orderBy, orderDirection]], // Sorting default (warehouse_id)
      attributes: ['branch_id', 'warehouse_name', 'address'], // Kolom yang akan diambil 
    });
  
    // Tambahkan data ke worksheet
    warehouses.forEach((warehouses, index) => {
      worksheet.addRow({
        no: index + 1,
        branch_name: warehouses.branch?.branch_name || '', 
        warehouse_name: warehouses.warehouse_name, 
        address: warehouses.address, 
      });
    });
  
    // Konversi workbook menjadi buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer;
    return buffer;
  }
   
}
