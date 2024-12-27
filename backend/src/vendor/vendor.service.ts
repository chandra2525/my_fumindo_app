import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Vendor} from './vendor.model'; 
import { VendorChangeLog } from '../vendorChangeLog/vendorChangeLog.model';
import { Op } from 'sequelize';  
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs'; 

@Injectable()
export class VendorService {
  constructor(
    @InjectModel(Vendor) private readonly vendorModel: typeof Vendor,
    @InjectModel(VendorChangeLog) private readonly vendorChangeLogModel: typeof VendorChangeLog, 
  ) {}

  async findAll( 
    vendor_name?: string,
    phone_number?: string,
    email?: string,
    address?: string,
    upcoming_review_date?: string,
    vendor_remark?: string,
    vendor_status?: string,
    orderBy: string = 'vendor_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ rows: Vendor[]; sp: any }> {
    const whereClause: any = {};
  
    if (vendor_name) {
      whereClause.vendor_name = { [Op.iLike]: `%${vendor_name}%` };  
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

    if (upcoming_review_date) {
      whereClause.upcoming_review_date = { [Op.iLike]: `%${upcoming_review_date}%` };  
    }

    if (vendor_remark) {
      whereClause.vendor_remark = { [Op.iLike]: `%${vendor_remark}%` };  
    }

    if (vendor_status) {
      whereClause.vendor_status = { [Op.iLike]: `%${vendor_status}%` };  
    }

    if (search) {
      whereClause[Op.or] = [
        { vendor_name: { [Op.iLike]: `%${search}%` } },
        { phone_number: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } },
        { upcoming_review_date: { [Op.iLike]: `%${search}%` } },
        { vendor_remark: { [Op.iLike]: `%${search}%` } },
        { vendor_status: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Pagination variables
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
  
    const { rows, count } = await this.vendorModel.findAndCountAll({
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
  
  
  async findOne(id: number): Promise<Vendor> {
    return this.vendorModel.findByPk(id);
  }

  // async create(vendor: Vendor): Promise<Vendor> {
  //   return this.vendorModel.create(vendor);
  // }

  async create(data: any): Promise<void> {
    const { vendor_name, phone_number, email, address, upcoming_review_date, vendor_remark, vendor_status } = data;

    // Insert into Vendor table and get vendor_id
    const vendorTable = await this.vendorModel.create({
      vendor_name,
      phone_number, 
      email,
      address,
      upcoming_review_date,
      vendor_remark,
      vendor_status,
    });

    const vendor = await this.vendorModel.findByPk(vendorTable.vendor_id);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    
    const changes: Array<{
      column_name: string;
      value_before: any;
      value_after: any;
    }> = [];

    // Periksa perubahan kolom
    for (const key in data) {
      if (data.hasOwnProperty(key) && vendor[key] !== undefined) {
        const oldValue = vendor[key];
        const newValue = data[key];

        // Perbandingan eksplisit
        const isDifferent =
          oldValue === null || newValue === null
            ? oldValue !== newValue
            : typeof oldValue === 'number' && typeof newValue === 'number'
            ? oldValue !== newValue // Perbandingan angka
            : String(oldValue) !== String(newValue); // Perbandingan string untuk tipe lain

        // if (isDifferent) {
          changes.push({
            column_name: key,
            value_before: oldValue,
            value_after: newValue,
          });
        // }
      }
    }

    console.log('Changes detected:', changes);

    // Hanya lanjutkan update jika ada perubahan
    // if (changes.length > 0) {
      // await vendor.update(data);

      // Catat semua perubahan ke vendor_change_log
      for (const change of changes) {
        console.log('Inserting change to log:', change);
        await this.vendorChangeLogModel.create({
          // vendor_id: vendorId,
          vendor_id: vendorTable.vendor_id,
          user_id: data.user_id,
          column_name: change.column_name,
          value_before: change.value_before,
          value_after: change.value_after,
          operation: data.operation,
        });
      }
    // }
  }

  // async update(id: number, data): Promise<[number, Vendor[]]> {
  //   return await this.vendorModel.update(data, {
  //     where: { vendor_id: id },
  //     returning: true, // Menambahkan opsi ini untuk mengembalikan data yang diperbarui
  //   });
  // }
  
  async update(vendorId: number, data: any): Promise<void> {
    const vendor = await this.vendorModel.findByPk(vendorId);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const changes: Array<{
      column_name: string;
      value_before: any;
      value_after: any;
    }> = [];

    // Periksa perubahan kolom
    for (const key in data) {
      if (data.hasOwnProperty(key) && vendor[key] !== undefined) {
        const oldValue = vendor[key];
        const newValue = data[key];

        // Perbandingan eksplisit
        const isDifferent =
          oldValue === null || newValue === null
            ? oldValue !== newValue
            : typeof oldValue === 'number' && typeof newValue === 'number'
            ? oldValue !== newValue // Perbandingan angka
            : String(oldValue) !== String(newValue); // Perbandingan string untuk tipe lain

        if (isDifferent) {
          changes.push({
            column_name: key,
            value_before: oldValue,
            value_after: newValue,
          });
        }
      }
    }

    console.log('Changes detected:', changes); // Log perubahan

    // Hanya lanjutkan update jika ada perubahan
    if (changes.length > 0) {
      await vendor.update(data);

      // Catat semua perubahan ke vendor_change_log
      for (const change of changes) {
        console.log('Inserting change to log:', change);
        await this.vendorChangeLogModel.create({
          vendor_id: vendorId,
          user_id: data.user_id, // Pastikan user_id disertakan dalam data
          column_name: change.column_name,
          value_before: change.value_before,
          value_after: change.value_after,
          operation: data.operation,
        });
      }
    }


    // if (vendor_name && category) { 
    //   // Use the vendor_id to insert into vendorChangeLog table
    //   await this.vendorChangeLogModel.create({
    //     vendor_id: vendor.vendor_id, // vendor_id contains the generated
    //     user_id, 
    //     column_name,
    //     value_before,
    //     value_after,
    //   });
    // }
  }

  async remove(id: number): Promise<void> {
    const vendor = await this.findOne(id);
    if (vendor) {
      await vendor.destroy();
    }
  }

  // async createVendor(userId: number, vendorData: Partial<Vendor>) {
  //   const newVendor = await this.vendorModel.create(vendorData);

  //   // Log operasi CREATE
  //   await this.vendorChangeLogModel.create({
  //     vendor_id: newVendor.vendor_id,
  //     user_id: userId,
  //     column_name: null, // Tidak ada kolom spesifik
  //     value_before: null,
  //     value_after: JSON.stringify(vendorData),
  //     operation: 'create',
  //   });

  //   return newVendor;
  // }

  // // Mengedit vendor
  // async updateVendor(userId: number, vendorId: number, updatedData: Partial<Vendor>) {
  //   const vendor = await this.vendorModel.findByPk(vendorId);

  //   if (!vendor) throw new Error('Vendor not found');

  //   // Log setiap kolom yang berubah
  //   for (const key of Object.keys(updatedData)) {
  //     const valueBefore = vendor[key];
  //     const valueAfter = updatedData[key];

  //     if (valueBefore !== valueAfter) {
  //       await this.vendorChangeLogModel.create({
  //         vendor_id: vendorId,
  //         user_id: userId,
  //         column_name: key,
  //         value_before: valueBefore,
  //         value_after: valueAfter,
  //         operation: 'update',
  //       });
  //     }
  //   }

  //   // Update data vendor
  //   await vendor.update(updatedData);

  //   return vendor;
  // }

  // // Menghapus vendor
  // async deleteVendor(userId: number, vendorId: number) {
  //   const vendor = await this.vendorModel.findByPk(vendorId);

  //   if (!vendor) throw new Error('Vendor not found');

  //   // Log operasi DELETE
  //   await this.vendorChangeLogModel.create({
  //     vendor_id: vendorId,
  //     user_id: userId,
  //     column_name: null, // Tidak ada kolom spesifik
  //     value_before: JSON.stringify(vendor),
  //     value_after: null,
  //     operation: 'delete',
  //   });

  //   // Hapus data vendor
  //   await vendor.destroy();

  //   return { message: 'Vendor deleted successfully' };
  // }

  
  async importVendors(file: Express.Multer.File): Promise<{ successCount: number; errors: any[] }> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' }); // Membaca file Excel
    const sheetName = workbook.SheetNames[0]; // Ambil sheet pertama
    // Ambil data termasuk header dan Konversi ke JSON
    const rawData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    
    // Ambil header dari baris pertama
    const [headers, ...rows] = rawData;
    // Mapping header file Excel ke nama variabel database
    const headerMap = {
      'No': null, 
      'Nama Penjual': 'vendor_name',
      'No Telpon': 'phone_number',
      'E-mail': 'email',
      'Alamat': 'address',
      'Tanggal Peninjauan Mendatang': 'upcoming_review_date',
      'Komentar Penjual': 'vendor_remark',
      'Status Penjual': 'vendor_status',
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
        if (!rowData.vendor_name ||!rowData.vendor_status) {
          throw new Error('Data tidak valid: kolom "Nama Penjual", "Status Penjual" diperlukan');
        } 
 
        // Simpan data ke database
        await this.vendorModel.create(rowData);
        successCount++;
      } catch (error) { 
        errors.push({ row: rowData, error: error.message });
      }
    }

    return { successCount, errors };
  }

  async generateTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template Data Nama Penjual');

    // Definisi Header
    const headers = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Nama Penjual', key: 'vendor_name', width: 40 },
      { header: 'No Telpon', key: 'phone_number', width: 15 },
      { header: 'E-mail', key: 'email', width: 30 },
      { header: 'Alamat', key: 'address', width: 60 },
      { header: 'Tanggal Peninjauan Mendatang', key: 'upcoming_review_date', width: 35 },
      { header: 'Komentar Penjual', key: 'vendor_remark', width: 50 },
      { header: 'Status Penjual', key: 'vendor_status', width: 17 },
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
      vendor_name: 'Isi nama penjual, maksimal 50 huruf', 
      phone_number: 'Isi no telpon penjual, maksimal 15 angka',
      email: 'Isi email penjual, maksimal 100 huruf',
      address: 'Isi alamat lengkap penjual, tidak ada batasan maksimal',
      upcoming_review_date: 'Isi tanggal peninjauan mendatang',
      vendor_remark: 'Isi komentar penjual penjual, tidak ada batasan maksimal',
      vendor_status: 'Isi status penjual, dengan pilihan "Available" atau "Unavailable"',
    });

    // Konversi workbook menjadi buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer; // Cast hasil menjadi Buffer
    return buffer;
  }
  
  
  async exportVendors(
    vendor_name?: string,
    phone_number?: string,
    email?: string,
    address?: string,
    upcoming_review_date?: string,
    vendor_remark?: string,
    vendor_status?: string,
    orderBy: string = 'vendor_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string, 
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data Nama Penjual');
  
    // Header Excel
    const headers = [       
      { header: 'No', key: 'no', width: 5 },
      { header: 'Nama Penjual', key: 'vendor_name', width: 40 },
      { header: 'No Telpon', key: 'phone_number', width: 15 },
      { header: 'E-mail', key: 'email', width: 30 },
      { header: 'Alamat', key: 'address', width: 60 },
      { header: 'Tanggal Peninjauan Mendatang', key: 'upcoming_review_date', width: 35 },
      { header: 'Komentar Penjual', key: 'vendor_remark', width: 50 },
      { header: 'Status Penjual', key: 'vendor_status', width: 17 },
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
  
    if (vendor_name) {
      whereClause.vendor_name = { [Op.iLike]: `%${vendor_name}%` };  
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

    if (upcoming_review_date) {
      whereClause.upcoming_review_date = { [Op.iLike]: `%${upcoming_review_date}%` };  
    }

    if (vendor_remark) {
      whereClause.vendor_remark = { [Op.iLike]: `%${vendor_remark}%` };  
    }

    if (vendor_status) {
      whereClause.vendor_status = { [Op.iLike]: `%${vendor_status}%` };  
    }

    if (search) {
      whereClause[Op.or] = [
        { vendor_name: { [Op.iLike]: `%${search}%` } },
        { phone_number: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } },
        { upcoming_review_date: { [Op.iLike]: `%${search}%` } },
        { vendor_remark: { [Op.iLike]: `%${search}%` } },
        { vendor_status: { [Op.iLike]: `%${search}%` } },
      ];
    }
    
    // Ambil data aset dari database
    const vendor = await this.vendorModel.findAll({
      where: whereClause,
      order: [[orderBy, orderDirection]],
      // attributes: ['vendor_name', 'phone_number', 'email', 'address'],
    });
  
    // Tambahkan data ke worksheet
    vendor.forEach((vendor, index) => {
      worksheet.addRow({
        no: index + 1, 
        vendor_name: vendor.vendor_name,
        phone_number: vendor.phone_number,
        email: vendor.email,
        address: vendor.address,
        upcoming_review_date: vendor.upcoming_review_date,
        vendor_remark: vendor.vendor_remark,
        vendor_status: vendor.vendor_status,
      });
    });
  
    // Konversi workbook menjadi buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer;
    return buffer;
  }
}
