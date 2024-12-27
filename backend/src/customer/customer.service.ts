import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Customer} from './customer.model'; 
import { Op } from 'sequelize';  
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs'; 

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer) private readonly customerModel: typeof Customer) {}

  async findAll( 
    customer_name?: string,
    phone_number?: string,
    email?: string,
    address?: string,
    orderBy: string = 'customer_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ rows: Customer[]; sp: any }> {
    const whereClause: any = {};
  
    if (customer_name) {
      whereClause.customer_name = { [Op.iLike]: `%${customer_name}%` };  
    }

    if (phone_number) {
      whereClause.phone_number = { [Op.iLike]: `%${phone_number}%` };  
    }

    if (email) {
      whereClause.email = { [Op.iLike]: `%${email}%` };  
    }

    if (address) {
      whereClause.address = { [Op.iLike]: `%${address}%` };  
    }

    if (search) {
      whereClause[Op.or] = [
        { customer_name: { [Op.iLike]: `%${search}%` } },
        { phone_number: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Pagination variables
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
  
    const { rows, count } = await this.customerModel.findAndCountAll({
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
  
  async findOne(id: number): Promise<Customer> {
    return this.customerModel.findByPk(id);
  }

  async create(customer: Customer): Promise<Customer> {
    return this.customerModel.create(customer);
  }

  async update(id: number, data): Promise<[number, Customer[]]> {
    return await this.customerModel.update(data, {
      where: { customer_id: id },
      returning: true, // Menambahkan opsi ini untuk mengembalikan data yang diperbarui
    });
  }

  async remove(id: number): Promise<void> {
    const customer = await this.findOne(id);
    if (customer) {
      await customer.destroy();
    }
  }

  async importAssetCustomers(file: Express.Multer.File): Promise<{ successCount: number; errors: any[] }> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' }); // Membaca file Excel
    const sheetName = workbook.SheetNames[0]; // Ambil sheet pertama
    // Ambil data termasuk header dan Konversi ke JSON
    const rawData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    
    // Ambil header dari baris pertama
    const [headers, ...rows] = rawData;
    // Mapping header file Excel ke nama variabel database
    const headerMap = {
      'No': null, 
      'Nama Pelanggan': 'customer_name',
      'No Telpon': 'phone_number',
      'E-mail': 'email',
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
        if (!rowData.customer_name ||!rowData.phone_number ||!rowData.email ||!rowData.address) {
          throw new Error('Data tidak valid: kolom "Nama Pelanggan", "No Telpon", "E-mail", "Alamat" diperlukan');
        } 
 
        // Simpan data ke database
        await this.customerModel.create(rowData);
        successCount++;
      } catch (error) { 
        errors.push({ row: rowData, error: error.message });
      }
    }

    return { successCount, errors };
  }

  async generateTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template Data Nama Pelanggan');

    // Definisi Header
    const headers = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Nama Pelanggan', key: 'customer_name', width: 40 },
      { header: 'No Telpon', key: 'phone_number', width: 33 },
      { header: 'E-mail', key: 'email', width: 40 },
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
      customer_name: 'Isi nama pelanggan, maksimal 50 huruf', 
      phone_number: 'Isi no telpon pelanggan, maksimal 15 angka',
      email: 'Isi email pelanggan, maksimal 100 huruf',
      address: 'Isi alamat lengkap pelanggan, tidak ada batasan maksimal',
    });

    // Konversi workbook menjadi buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer; // Cast hasil menjadi Buffer
    return buffer;
  }
  
  
  async exportAssetCustomers(
    customer_name?: string,
    phone_number?: string,
    email?: string,
    address?: string, 
    orderBy: string = 'customer_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string, 
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data Nama Pelanggan');
  
    // Header Excel
    const headers = [       
      { header: 'No', key: 'no', width: 5 }, 
      { header: 'Nama Pelanggan', key: 'customer_name', width: 40 },
      { header: 'No Telpon', key: 'phone_number', width: 33 },
      { header: 'E-mail', key: 'email', width: 40 },
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
  
    if (customer_name) {
      whereClause.customer_name = { [Op.iLike]: `%${customer_name}%` };  
    }

    if (phone_number) {
      whereClause.phone_number = { [Op.iLike]: `%${phone_number}%` };  
    }

    if (email) {
      whereClause.email = { [Op.iLike]: `%${email}%` };  
    }

    if (address) {
      whereClause.address = { [Op.iLike]: `%${address}%` };  
    }

    if (search) {
      whereClause[Op.or] = [
        { customer_name: { [Op.iLike]: `%${search}%` } },
        { phone_number: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } },
      ];
    }
    
    // Ambil data aset dari database
    const customer = await this.customerModel.findAll({
      where: whereClause,
      order: [[orderBy, orderDirection]],
      attributes: ['customer_name', 'phone_number', 'email', 'address'],
    });
  
    // Tambahkan data ke worksheet
    customer.forEach((customer, index) => {
      worksheet.addRow({
        no: index + 1, 
        customer_name: customer.customer_name,
        phone_number: customer.phone_number,
        email: customer.email,
        address: customer.address,
      });
    });
  
    // Konversi workbook menjadi buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer;
    return buffer;
  }
}
