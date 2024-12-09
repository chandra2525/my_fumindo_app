// src/services/employee.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Employee } from './employee.model';
import { Branch } from '../branch/branch.model';
import { User } from '../users/users.model';
import * as bcrypt from 'bcryptjs';
import { Op, Sequelize } from 'sequelize';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs'; 

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee) private readonly employeeModel: typeof Employee,
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}

  async findAll(
    branchNames?: string[], 
    fullname?: string,
    phone_number?: string,
    email?: string,
    address?: string, 
    employeeDivision?: string[], 
    employeeStatus?: string[], 
    orderBy: string = 'employee_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ rows: Employee[]; sp: any }> {
    const whereClause: any = {};
  
    // if (branchNames?.length) {
    //   whereClause.branch_name = { [Op.in]: branchNames }; // Filter branch_name
    // }
    if (fullname) {
      whereClause.fullname = { [Op.iLike]: `%${fullname}%` };  
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
    if (employeeDivision?.length) {
      whereClause.division = { [Op.in]: employeeDivision };
    }
    if (employeeStatus?.length) {
      whereClause.status = { [Op.in]: employeeStatus };
    }

    if (search) {
      whereClause[Op.or] = [
        { fullname: { [Op.iLike]: `%${search}%` } },
        { phone_number: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } }, 
        { division: { [Op.iLike]: `%${search}%` } }, 
        { status: { [Op.iLike]: `%${search}%` } }, 
        // Sequelize.where(Sequelize.cast(Sequelize.col('employee_id'), 'TEXT'), {
        //   [Op.iLike]: `%${search}%`,
        // }),
        { '$branch.branch_name$': { [Op.iLike]: `%${search}%` } }, 
      ];
    }
    
    // return this.employeeModel.findAll();
    // return this.employeeModel.findAll({
    //   include: [
    //     {
    //       model: Branch, // Model branch
    //       attributes: ['branch_name'], // Hanya mengambil nama cabang
    //       where: branchNames?.length
    //       ? { branch_name: { [Op.in]: branchNames } } // Filter branch_name jika diberikan
    //       : undefined, // Jika tidak ada filter branch_name, jangan tambahkan where
    //     },
    //   ],
    //   where: whereClause,
    //   // order: [[orderBy, orderDirection]], 
    //   order: orderBy === 'branch_name' // Cek jika sorting berdasarkan branch_name
    //   ? [[{ model: Branch, as: 'branch' }, 'branch_name', orderDirection]] // Sorting berdasarkan branch_name
    //   : [[orderBy, orderDirection]], // Sorting default (employee_id)
    // });

    // Pagination variables
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
  
    const { rows, count } = await this.employeeModel.findAndCountAll({
      include: [
        {
          model: Branch, // Model branch
          attributes: ['branch_name'], // Hanya mengambil nama cabang
          where: branchNames?.length
          ? { branch_name: { [Op.in]: branchNames } } // Filter branch_name jika diberikan
          : undefined, // Jika tidak ada filter branch_name, jangan tambahkan where
        },
      ],
      where: whereClause,
      // order: [[orderBy, orderDirection]], 
      order: orderBy === 'branch_name' // Cek jika sorting berdasarkan branch_name
      ? [[{ model: Branch, as: 'branch' }, 'branch_name', orderDirection]] // Sorting berdasarkan branch_name
      : [[orderBy, orderDirection]], // Sorting default (employee_id)
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

  async getEmployeesStatus(): Promise<string[]> {
    const employeesStatus = await this.employeeModel.findAll({
      attributes: ['status'],
    });
    return employeesStatus.map(employee => employee.status);
  }

  async getEmployeesDivision(): Promise<string[]> {
    const employeesDivision = await this.employeeModel.findAll({
      attributes: ['division'],
    });
    return employeesDivision.map(employee => employee.division);
  }

  async findOne(id: number): Promise<Employee> {
    return this.employeeModel.findByPk(id);
  }

  // async create(employee: Employee): Promise<Employee> {
  //   return this.employeeModel.create(employee);
  // }

  async create(data: any): Promise<void> {
    const { branch_id, fullname, phone_number, email, address, division, status, username, password, type_user, role } = data;

    // Insert into Employee table and get employee_id
    const employee = await this.employeeModel.create({
      branch_id,
      fullname,
      phone_number,
      email,
      address,
      division, 
      status,
    });
    
    if (username && password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      // Use the employee_id to insert into User table
      await this.userModel.create({
        employee_id: employee.employee_id, // employee.id contains the generated employee_id
        username,
        password: hashedPassword,
        type_user,
        role,
      });
    }
  }

  // async update(id: number, employee: Employee): Promise<Employee> {
  //   await this.employeeModel.update(employee, { where: { employee_id: id } });
  //   return this.findOne(id);
  // }

  async update(employeeId: number, data: any): Promise<void> {
    const { user_id, branch_id, fullname, phone_number, email, address, division, status, username, password, type_user, role } = data;

    const employee = await this.employeeModel.findByPk(employeeId);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Update Employee table
    await employee.update({
      branch_id,
      fullname,
      phone_number,
      email,
      address,
      division,
      status,
    });

    // Handle User table update/insert if username and password are provided
    if (username && password) {
      // Update User table (assume user_id is unique)
      // const user = await this.userModel.findOne({ where: { user_id } });
      // Update or Insert User table (linked by employee_id)
      const user = await this.userModel.findOne({ where: { employee_id: employee.employee_id } });
      const hashedPassword = await bcrypt.hash(password, 10);
      if (user) {
        await user.update({ 
          // employee_id,
          username, 
          password: hashedPassword,
          type_user,
          role,
        });
      } else {
        // await this.userModel.create({ 
        //   employee_id, username, password, type_user 
        // }); 
        await this.userModel.create({
          employee_id: employee.employee_id,
          username,
          password: hashedPassword,
          type_user,
          role,
        });
      }
    }
  }

  async remove(id: number): Promise<void> {
    const employee = await this.findOne(id);
    if (!employee) {
      throw new Error('Employee not found');
    }
    await employee.destroy();
  }

  async importEmployes(file: Express.Multer.File): Promise<{ successCount: number; errors: any[] }> {
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
      'Nama Karyawan': 'fullname',
      'No Telpon': 'phone_number',
      'E-mail': 'email',
      'Alamat': 'address',
      'Divisi': 'division',
      // 'Status': 'status',
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
        // const key = mappedHeaders[index];
        const key = headerMap[headers[index].trim()];
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
        // if (!rowData.branch_id ||!rowData.fullname ||!rowData.phone_number ||!rowData.email ||!rowData.address ||!rowData.division) {
        if (!rowData.branch_id ||!rowData.fullname) {
          throw new Error('Data tidak valid: kolom "ID Cabang", "Nama Karyawan", "No Telpon", "E-mail", "Alamat", "Divisi" diperlukan');
        }

        rowData.status = 'Offline';
        // Simpan data ke database
        await this.employeeModel.create(rowData);
        successCount++;
      } catch (error) { 
        errors.push({ row: rowData, error: error.message });
      }
    }

    return { successCount, errors };
  }

  async generateTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template Data Karyawan');

    // Definisi Header
    const headers = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Nama Cabang', key: 'branch_name', width: 25 },
      { header: 'Nama Karyawan', key: 'fullname', width: 39 },
      { header: 'No Telpon', key: 'phone_number', width: 33 },
      { header: 'E-mail', key: 'email', width: 40 },
      { header: 'Alamat', key: 'address', width: 50 },
      { header: 'Divisi', key: 'division', width: 32 }, 
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
      branch_name: 'Isi nama cabang',
      fullname: 'Isi nama lengkap karyawan, maksimal 100 huruf',
      phone_number: 'Isi no telpon karyawan, maksimal 15 angka',
      email: 'Isi email karyawan, maksimal 100 huruf',
      address: 'Isi alamat lengkap karyawan, tidak ada batasan maksimal',
      // division: 'Isi divisi karyawan, maksimal 50 huruf',
      division: "Isi divisi karyawan dengan pilihan 'Admin', 'Director of Fumindo', 'Technician Manager', 'Technician and Operational', 'Service Technician'",
      // status: '',
    });

    // Konversi workbook menjadi buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer; // Cast hasil menjadi Buffer
    return buffer;
  }
  
  async exportEmployees(
    branchNames?: string[], 
    fullname?: string,
    phone_number?: string,
    email?: string,
    address?: string, 
    employeeDivision?: string[], 
    employeeStatus?: string[], 
    orderBy: string = 'employee_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data Karyawan');
  
    // Header Excel
    const headers = [      
      { header: 'No', key: 'no', width: 5 },
      { header: 'Nama Cabang', key: 'branch_name', width: 25 },
      { header: 'Nama Karyawan', key: 'fullname', width: 39 },
      { header: 'No Telpon', key: 'phone_number', width: 33 },
      { header: 'E-mail', key: 'email', width: 40 },
      { header: 'Alamat', key: 'address', width: 50 },
      { header: 'Divisi', key: 'division', width: 32 },
      // { header: 'Status', key: 'status', width: 30 },
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
  
    if (fullname) {
      whereClause.fullname = { [Op.iLike]: `%${fullname}%` };  
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
    if (employeeDivision?.length) {
      whereClause.division = { [Op.in]: employeeDivision };
    }
    if (employeeStatus?.length) {
      whereClause.status = { [Op.in]: employeeStatus };
    }

    if (search) {
      whereClause[Op.or] = [
        { fullname: { [Op.iLike]: `%${search}%` } },
        { phone_number: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } }, 
        { division: { [Op.iLike]: `%${search}%` } }, 
        { status: { [Op.iLike]: `%${search}%` } }, 
        // Sequelize.where(Sequelize.cast(Sequelize.col('employee_id'), 'TEXT'), {
        //   [Op.iLike]: `%${search}%`,
        // }),
        { '$branch.branch_name$': { [Op.iLike]: `%${search}%` } }, 
      ];
    }
    
    // Ambil data karyawan dari database
    const employees = await this.employeeModel.findAll({
      include: [
        {
          model: Branch, // Model branch
          attributes: ['branch_name'], // Hanya mengambil nama cabang
          where: branchNames?.length
          ? { branch_name: { [Op.in]: branchNames } } // Filter branch_name jika diberikan
          : undefined, // Jika tidak ada filter branch_name, jangan tambahkan where
        },
      ],
      where: whereClause,
      order: orderBy === 'branch_name' // Cek jika sorting berdasarkan branch_name
      ? [[{ model: Branch, as: 'branch' }, 'branch_name', orderDirection]] // Sorting berdasarkan branch_name
      : [[orderBy, orderDirection]], // Sorting default (employee_id)
      attributes: ['branch_id', 'fullname', 'phone_number', 'email', 'address', 'division', 'status'], // Kolom yang akan diambil 
    });
  
    // Tambahkan data ke worksheet
    employees.forEach((employee, index) => {
      worksheet.addRow({
        no: index + 1,
        branch_name: employee.branch?.branch_name || '', 
        fullname: employee.fullname,
        phone_number: employee.phone_number,
        email: employee.email,
        address: employee.address,
        division: employee.division,
        status: employee.status,
      });
    });
  
    // Konversi workbook menjadi buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer;
    return buffer;
  }
  
}
