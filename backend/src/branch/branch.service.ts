import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Branch } from './branch.model';
import { Op } from 'sequelize';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import { Buffer } from 'node:buffer';

@Injectable()
export class BranchService {
  constructor(@InjectModel(Branch) private branchModel: typeof Branch) {}

  async create(data): Promise<Branch> {
    return await this.branchModel.create(data);
  }

  async findAll(
    orderBy: string = 'branch_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
  ): Promise<Branch[]> {
    return await this.branchModel.findAll({  
      order: [[orderBy, orderDirection]], 
    });
  }

  async findOne(id: number): Promise<Branch> {
    return await this.branchModel.findByPk(id);
  }

  async update(id: number, data): Promise<[number, Branch[]]> {
    return await this.branchModel.update(data, {
      where: { branch_id: id },
      returning: true, // Menambahkan opsi ini untuk mengembalikan data yang diperbarui
    });
  }
  
  async delete(id: number): Promise<void> {
    await this.branchModel.destroy({ where: { branch_id: id } });
  }

  // async getFilter(branchNames?: string[]): Promise<Branch[]> {
  //   const whereClause = branchNames?.length
  //     ? { branch_name: { [Op.in]: branchNames } } // Filter menggunakan `Op.in`
  //     : {};
  //   return this.branchModel.findAll({ where: whereClause });
  // }

  async getFilter(
    branchNames?: string[], 
    address?: string,
    orderBy: string = 'branch_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ rows: Branch[]; sp: any }> {
    const whereClause: any = {};
  
    if (branchNames?.length) {
      whereClause.branch_name = { [Op.in]: branchNames }; // Filter branch_name
    }
    if (address) {
      whereClause.address = { [Op.iLike]: `%${address}%` }; // Filter address menggunakan LIKE
    }

    if (search) {
      whereClause[Op.or] = [
        { branch_name: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } },
        // { branch_id: { [Op.like]: `%${search}%` } },
      ];
    }

    // return this.branchModel.findAll({ 
    //   where: whereClause,
    //   order: [[orderBy, orderDirection]], 
    // }); 
    
    // Pagination variables
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
  
    const { rows, count } = await this.branchModel.findAndCountAll({
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
  

  async getBranchNames(): Promise<string[]> {
    const branches = await this.branchModel.findAll({
      attributes: ['branch_name'], // Ambil hanya field branch_name
    });
    return branches.map(branch => branch.branch_name);
  }

  // Fungsi untuk import data cabang dari file Excel
  async importBranches(file: Express.Multer.File): Promise<{ successCount: number; errors: any[] }> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' }); // Membaca file Excel
    const sheetName = workbook.SheetNames[0]; // Ambil sheet pertama
    // const data: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]); // Konversi ke JSON
    const rawData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 }); // Ambil data termasuk header
    
    // Ambil header dari baris pertama
    const [headers, ...rows] = rawData;
    // Mapping header file Excel ke nama variabel database
    const headerMap = {
      'No': null,
      'Nama Cabang': 'branch_name',
      'Alamat': 'address',
    };
     // Bersihkan header yang kosong atau undefined
    const cleanedHeaders = headers.map(header => (header || '').trim());
    const mappedHeaders = cleanedHeaders.map(header => headerMap[header] || null);
    // const mappedHeaders = headers.map(header => headerMap[header] || null);
    
    // Periksa jika ada header yang tidak dikenali
    const unknownHeaders = cleanedHeaders.filter((_, index) => mappedHeaders[index] === null && headerMap[cleanedHeaders[index]] === undefined);
    if (unknownHeaders.length > 0) {
      throw new BadRequestException(
        `Unknown headers: ${unknownHeaders.join(', ')}. Expected headers are: ${Object.keys(headerMap).join(', ')}`
      );
    }

    // if (mappedHeaders.includes(null)) {
    // if (mappedHeaders.includes(null) && headers.some(header => !headerMap[header])) {
    //   // const unknownHeaders = headers.filter((_, index) => mappedHeaders[index] === null);
    //   const unknownHeaders = headers.filter((_, index) => mappedHeaders[index] === null && headerMap[headers[index]] === undefined);
    //   throw new BadRequestException(
    //     `Unknown headers: ${unknownHeaders.join(', ')}. Expected headers are: ${Object.keys(headerMap).join(', ')}`
    //   );
    // }  
 
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
        // Validasi data (sesuaikan dengan model Branch Anda)
        if (!rowData.branch_name || !rowData.address) {
          throw new Error('Data tidak valid: kolom "Nama Cabang" and "Alamat" diperlukan');
        }

        // Simpan data ke database
        await this.branchModel.create(rowData);
        // await this.branchModel.create({
        //   branch_name: row.branch_name,
        //   address: row.address,
        // });
        successCount++;
      } catch (error) {
        // errors.push({ row, error: error.message });
        errors.push({ row: rowData, error: error.message });
      }
    }

    return { successCount, errors };
  }

  async generateTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template Data Cabang');

    // Definisi Header
    const headers = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Nama Cabang', key: 'branch_name', width: 37 },
      { header: 'Alamat', key: 'address', width: 50 },
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
        fgColor: { argb: 'F95454' }, // Warna pink header
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
      branch_name: 'Isi nama cabang, maksimal 100 huruf',
      address: 'Isi alamat lengkap, tidak ada batasan maksimal',
    });

    // Konversi workbook menjadi buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer; // Cast hasil menjadi Buffer
    return buffer;
  }
  
  async exportBranches(
    branchNames?: string[], 
    address?: string,
    orderBy: string = 'branch_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string, 
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data Cabang');
  
    // Header Excel
    const headers = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Nama Cabang', key: 'branch_name', width: 37 },
      { header: 'Alamat', key: 'address', width: 50 },
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
  
    if (branchNames?.length) {
      whereClause.branch_name = { [Op.in]: branchNames }; // Filter branch_name
    }
    if (address) {
      whereClause.address = { [Op.iLike]: `%${address}%` }; // Filter address menggunakan LIKE
    }

    if (search) {
      whereClause[Op.or] = [
        { branch_name: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } },
        // { branch_id: { [Op.like]: `%${search}%` } },
      ];
    }
    
    // Ambil data cabang dari database
    const branches = await this.branchModel.findAll({
      where: whereClause,
      order: [[orderBy, orderDirection]],
      attributes: ['branch_name', 'address'], // Kolom yang akan diambil 
    });
  
    // Tambahkan data ke worksheet
    branches.forEach((branch, index) => {
      worksheet.addRow({
        no: index + 1,
        branch_name: branch.branch_name,
        address: branch.address,
      });
    });
  
    // Konversi workbook menjadi buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer;
    return buffer;
  }

  
}
