import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model'; 
import { Employee } from '../employee/employee.model';
import * as bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs'; 

@Injectable()
export class UsersService {
//   private readonly users = [
//     { userId: 1, username: 'testuser', password: bcrypt.hashSync('password', 10) },
//   ];

  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findUser(username: string) {
    return this.userModel.findOne({
      where: { username },
    });
  }

  async findAll(
    fullname?: string,
    username?: string, 
    userRole?: string[], 
    orderBy: string = 'user_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ rows: User[]; sp: any }> {
    const whereClause: any = {};
    if (username) {
      whereClause.username = { [Op.iLike]: `%${username}%` };  
    }
    if (userRole?.length) {
      whereClause.role = { [Op.in]: userRole };
    }

    if (search) {
      whereClause[Op.or] = [
        { username: { [Op.iLike]: `%${search}%` } },
        { role: { [Op.iLike]: `%${search}%` } },
        // Sequelize.where(Sequelize.cast(Sequelize.col('employee_id'), 'TEXT'), {
        //   [Op.iLike]: `%${search}%`,
        // }),
        { '$employee.fullname$': { [Op.iLike]: `%${search}%` } }, 
      ];
    }
    // return this.userModel.findAll();
    // return this.userModel.findAll({
    //     include: [
    //       {
    //         model: Employee, // Model employee
    //         attributes: ['fullname'], // Hanya mengambil nama
    //         where: fullname?.length
    //         ? { fullname: { [Op.iLike]: `%${fullname}%` } } // Filter fullname jika diberikan
    //         : undefined, // Jika tidak ada filter fullname, jangan tambahkan where
    //       },
    //     ],
    //     where: whereClause,
    //     // order: [[orderBy, orderDirection]], 
    //     order: orderBy === 'fullname' // Cek jika sorting berdasarkan fullname
    //     ? [[{ model: Employee, as: 'employee' }, 'fullname', orderDirection]] // Sorting berdasarkan fullname
    //     : [[orderBy, orderDirection]], // Sorting default (employee_id)
    // });

    // Pagination variables
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
  
    const { rows, count } = await this.userModel.findAndCountAll({
      include: [
        {
          model: Employee, // Model employee
          attributes: ['fullname'], // Hanya mengambil nama
          where: fullname?.length
          ? { fullname: { [Op.iLike]: `%${fullname}%` } } // Filter fullname jika diberikan
          : undefined, // Jika tidak ada filter fullname, jangan tambahkan where
        },
      ],
      where: whereClause,
      // order: [[orderBy, orderDirection]], 
      order: orderBy === 'fullname' // Cek jika sorting berdasarkan fullname
      ? [[{ model: Employee, as: 'employee' }, 'fullname', orderDirection]] // Sorting berdasarkan fullname
      : [[orderBy, orderDirection]], // Sorting default (user_id)
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

  async getUsersRole(): Promise<string[]> {
    const usersRole = await this.userModel.findAll({
      attributes: ['role'],
    });
    return usersRole.map(user => user.role);
  }

  async findOne(id: number): Promise<User> {
    return this.userModel.findByPk(id);
  }

  // async create(user: User): Promise<User> {
  //   return this.userModel.create(user);
  // }

  async create(data: any): Promise<void> {
    const { employee_id, username, password, type_user, role } = data;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert into Employee table and get employee_id
    await this.userModel.create({
      employee_id,
      username,
      password: hashedPassword,
      type_user, 
      role, 
    });
    
    // if (username && password) {
    //   const hashedPassword = await bcrypt.hash(password, 10);
    //   // Use the employee_id to insert into User table
    //   await this.userModel.create({
    //     employee_id: employee.employee_id, // employee.id contains the generated employee_id
    //     username,
    //     password: hashedPassword,
    //     type_user,
    //   });
    // }
  }

  // async update(id: number, user: User): Promise<User> {
  //   await this.userModel.update(user, { where: { user_id: id } });
  //   return this.findOne(id);
  // }

  async update(userId: number, data: any): Promise<void> {
    const { employee_id, username, password, type_user, role } = data;

    const employee = await this.userModel.findByPk(userId);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    
    // Update Employee table
    if (password=='') {
      await employee.update({
        // employee_id: employee.employee_id,
        employee_id,
        username,
        role,
      });
    }else{
      const hashedPassword = await bcrypt.hash(password, 10);
      await employee.update({
        // employee_id: employee.employee_id,
        employee_id,
        username,
        password: hashedPassword,
        type_user,
        role,
      });
    }
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (user) {
      await user.destroy();
    }
  }

  async importUsers(file: Express.Multer.File): Promise<{ successCount: number; errors: any[] }> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' }); // Membaca file Excel
    const sheetName = workbook.SheetNames[0]; // Ambil sheet pertama
    // Ambil data termasuk header dan Konversi ke JSON
    const rawData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    
    // Ambil header dari baris pertama
    const [headers, ...rows] = rawData;
    // Mapping header file Excel ke nama variabel database
    const headerMap = {
      'No': null,
      'ID Karyawan': 'employee_id',
      'Username': 'username',
      'Password': 'password',
      // 'Type User': 'type_user',
      'Role': 'role', 
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
        // Validasi data (sesuaikan dengan model Anda)
        if (!rowData.username ||!rowData.password) {
          throw new Error('Data tidak valid: kolom "Username", "Password" diperlukan');
        }
        const hashedPassword = await bcrypt.hash(rowData.password, 10);
        rowData.password = hashedPassword;
        rowData.type_user = 'Employee';
        // Simpan data ke database
        await this.userModel.create(rowData);
        successCount++;
      } catch (error) { 
        errors.push({ row: rowData, error: error.message });
      }
    }

    return { successCount, errors };
  }

  async generateTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template Data User');

    // Definisi Header
    const headers = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'ID Karyawan', key: 'employee_id', width: 13 },
      { header: 'Username', key: 'username', width: 32 },
      { header: 'Password', key: 'password', width: 32 },
      { header: 'Role', key: 'role', width: 53 }, 
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
      employee_id: 1,
      username: 'Isi username, maksimal 30 huruf',
      password: 'Isi password, maksimal 30 huruf',
      role: "Isi role dengan pilihan 'Admin', 'Manajer Teknis', 'Petugas Lapangan'",
    });

    // Konversi workbook menjadi buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer; // Cast hasil menjadi Buffer
    return buffer;
  }
  
  async exportUsers(
    fullname?: string,
    username?: string, 
    userRole?: string[], 
    orderBy: string = 'user_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data User');
  
    // Header Excel
    const headers = [      
      { header: 'No', key: 'no', width: 5 },
      { header: 'ID Karyawan', key: 'employee_id', width: 13 },
      { header: 'Username', key: 'username', width: 32 },
      { header: 'Password', key: 'password', width: 32 },
      { header: 'Role', key: 'role', width: 32 },  
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
  
    if (username) {
      whereClause.username = { [Op.iLike]: `%${username}%` };  
    }
    if (userRole?.length) {
      whereClause.role = { [Op.in]: userRole };
    }

    if (search) {
      whereClause[Op.or] = [
        { username: { [Op.iLike]: `%${search}%` } },
        { role: { [Op.iLike]: `%${search}%` } },
        { '$employee.fullname$': { [Op.iLike]: `%${search}%` } }, 
      ];
    }
    
    // Ambil data User dari database
    const users = await this.userModel.findAll({
      include: [
        {
          model: Employee, // Model employee
          attributes: ['fullname'], // Hanya mengambil nama
          where: fullname?.length
          ? { fullname: { [Op.iLike]: `%${fullname}%` } } // Filter fullname jika diberikan
          : undefined, // Jika tidak ada filter fullname, jangan tambahkan where
        },
      ],
      where: whereClause, 
      order: orderBy === 'fullname' // Cek jika sorting berdasarkan fullname
      ? [[{ model: Employee, as: 'employee' }, 'fullname', orderDirection]] // Sorting berdasarkan fullname
      : [[orderBy, orderDirection]], // Sorting default (user_id)
      attributes: ['employee_id', 'username', 'role'], // Kolom yang akan diambil 
    });
  
    // Tambahkan data ke worksheet
    users.forEach((users, index) => {
      worksheet.addRow({
        no: index + 1,
        employee_id: users.employee_id,
        username: users.username,
        password: '',
        role: users.role, 
      });
    });
  
    // Konversi workbook menjadi buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer;
    return buffer;
  }
  
//   async findAll() {
//     return this.users.map(user => ({ userId: user.userId, username: user.username }));
//   }

//   async findOne(username: string) {
//     return this.users.find(user => user.username === username);
//   }
  
//   async findOneById(id: number) {
//     return this.users.find(user => user.userId === id);
//   }

//   async create(createUserDto: { username: string; password: string }) {
//     const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
//     const newUser = {
//       userId: this.users.length + 1,
//       username: createUserDto.username,
//       password: hashedPassword,
//     };
//     this.users.push(newUser);
//     return { userId: newUser.userId, username: newUser.username };
//   }
}
