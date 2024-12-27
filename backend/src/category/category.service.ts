import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './category.model';
import { Sequelize } from 'sequelize-typescript';
import * as ExcelJS from 'exceljs'; 
import { Op } from 'sequelize';
import * as XLSX from 'xlsx';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category) private categoryModel: typeof Category,
    private readonly sequelize: Sequelize, // Tambahkan Sequelize
  ) {}

  async getRecursiveHierarchy(
    category_name?: string,
    levels?: string[], 
    path?: string,
    orderBy: string = 'category_id',
    orderDirection: 'ASC' | 'DESC' = 'ASC',
    search?: string,
    page: number = 1,
    pageSize: number = 10,
  ) {
    // Pagination variables
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    // Dynamic conditions
    const whereConditions: string[] = [];

    if (category_name) {
      whereConditions.push(`category_name ILIKE '%${category_name}%'`);
    }

    // if (level) {
    //   whereConditions.push(`level = ${level}`);
    // }
    if (levels && levels.length > 0) {
      const levelsList = levels.map((level) => `'${level}'`).join(', '); // Format as a comma-separated list
      whereConditions.push(`level IN (${levelsList})`);
    }

    // if (path) {
    //   whereConditions.push(`path = ${path}`);
    // }
    if (path) {
        whereConditions.push(`path ILIKE '%${path}%'`);
    }

    if (search) {
      whereConditions.push(`(category_name ILIKE '%${search}%' OR CAST(level AS TEXT) ILIKE '%${search}%' OR path ILIKE '%${search}%' )`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Final query with dynamic filters, order, and pagination
    const query = `
        WITH RECURSIVE category_hierarchy AS (
        SELECT 
            category_id,
            category_name,
            parent_id,
            level,
            category_name::VARCHAR AS path
        FROM category
        WHERE parent_id IS NULL
        UNION ALL
        SELECT 
            c.category_id,
            c.category_name,
            c.parent_id,
            c.level,
            (ch.path || ' > ' || c.category_name)::VARCHAR AS path
        FROM category c
        INNER JOIN category_hierarchy ch ON c.parent_id = ch.category_id
        )
        SELECT * 
        FROM category_hierarchy
        ${whereClause}
        ORDER BY ${orderBy} ${orderDirection}
        LIMIT ${limit} OFFSET ${offset};
    `;

    // Execute query
    const [results] = await this.sequelize.query(query);

    // Count total rows for pagination
    const countQuery = `
        WITH RECURSIVE category_hierarchy AS (
        SELECT 
            category_id,
            category_name,
            parent_id,
            level,
            category_name::VARCHAR AS path
        FROM category
        WHERE parent_id IS NULL
        UNION ALL
        SELECT 
            c.category_id,
            c.category_name,
            c.parent_id,
            c.level,
            (ch.path || ' > ' || c.category_name)::VARCHAR AS path
        FROM category c
        INNER JOIN category_hierarchy ch ON c.parent_id = ch.category_id
        )
        SELECT COUNT(*) as total 
        FROM category_hierarchy
        ${whereClause};
    `;
    const [countResult] = await this.sequelize.query(countQuery);
    const totalRows = (countResult as { total: number }[])[0].total;

    // Pagination metadata
    const sp = {
      page,
      pageSize,
      pageCount: Math.ceil(totalRows / pageSize),
      rowCount: totalRows,
      start: offset,
      limit,
    };

    return { rows: results, sp };
  }
  
  async getLevels(): Promise<any> {
    const categories = await Category.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('level')), 'level'],
      ],
      order: [
        ['level', 'ASC'],
      ],
    });
    
    return categories;
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.findAll({ include: { all: true } });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryModel.findByPk(id, { include: { all: true } });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async create(data: any): Promise<Category> {
    return this.categoryModel.create(data);
  }

  async update(id: number, data: any): Promise<Category> {
    const category = await this.findOne(id);
    return category.update(data);
  }

  async delete(id: number): Promise<void> {
    const category = await this.findOne(id);
    await category.destroy();
  }
  

  async importCategories(file: Express.Multer.File): Promise<{ successCount: number; errors: any[] }> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' }); // Membaca file Excel
    const sheetName = workbook.SheetNames[0]; // Ambil sheet pertama
    // Ambil data termasuk header dan Konversi ke JSON
    const rawData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    
    // Ambil header dari baris pertama
    const [headers, ...rows] = rawData;
    // Mapping header file Excel ke nama variabel database
    const headerMap = {
      'No': null,
      'ID Kategori Induk': 'parent_id',
      'Nama Kategori': 'category_name',
      'Level': 'level', 
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
        if (!rowData.category_name ||!rowData.level) {
          throw new Error('Data tidak valid: kolom "ID Kategori Induk", "Nama Kategori", "Level" diperlukan');
        }
  
        // Simpan data ke database
        await this.categoryModel.create(rowData);
        successCount++;
      } catch (error) { 
        errors.push({ row: rowData, error: error.message });
      }
    }

    return { successCount, errors };
  }

  async generateTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template Data Category');

    // Definisi Header
    const headers = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'ID Kategori Induk', key: 'parent_id', width: 32 },
      { header: 'Nama Kategori', key: 'category_name', width: 32 },
      { header: 'Level', key: 'level', width: 8 }, 
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
      parent_id: 'Isi id kategori induk yang sesuai',
      category_name: 'Isi nama kategori, maksimal 30 huruf', 
      level: 'Isi level kategori dengan pilihan "1","2"atau"3"',
    });

    // Konversi workbook menjadi buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer; // Cast hasil menjadi Buffer
    return buffer;
  }

  async exportCategory(
    category_name?: string,
    levels?: string[],
    orderBy: string = 'category_id',
    orderDirection: 'ASC' | 'DESC' = 'ASC',
    search?: string,
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data Warehouse');
  
    // Header Excel
    const headers = [      
      { header: 'No', key: 'no', width: 5 },
      { header: 'ID Kategori Induk', key: 'parent_id', width: 32 },
      { header: 'Nama Kategori', key: 'category_name', width: 32 },
      { header: 'Level', key: 'level', width: 8 },  
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
  
    if (category_name) {
      whereClause.category_name = { [Op.iLike]: `%${category_name}%` };  
    }
    if (levels?.length) {
        whereClause.level = { [Op.in]: levels };
      }
    if (search) {
      whereClause[Op.or] = [
        { category_name: { [Op.iLike]: `%${search}%` } },
        { level: { [Op.iLike]: `%${search}%` } },  
      ];
    }
    
    // Ambil data Warehouse dari database
    const categoryes = await this.categoryModel.findAll({
      where: whereClause, 
      order: [[orderBy, orderDirection]], // Sorting default (warehouse_id)
      attributes: ['category_name', 'parent_id', 'level'], // Kolom yang akan diambil 
    });
  
    // Tambahkan data ke worksheet
    categoryes.forEach((categoryes, index) => {
      worksheet.addRow({
        no: index + 1,
        parent_id: categoryes.parent_id, 
        category_name: categoryes.category_name, 
        level: categoryes.level, 
      });
    });
  
    // Konversi workbook menjadi buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer;
    return buffer;
  }

  // async exportCategory(
  //   category_name?: string,
  //   levels?: string[], 
  //   path?: string,
  //   orderBy: string = 'category_id',
  //   orderDirection: 'ASC' | 'DESC' = 'ASC',
  //   search?: string,
  // ): Promise<Buffer> {
  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet('Data Warehouse');
  
  //   // Header Excel
  //   const headers = [      
  //     { header: 'No', key: 'no', width: 5 },
  //     { header: 'Kategori Induk', key: 'parent_category_name', width: 32 },
  //     { header: 'Nama Kategori', key: 'category_name', width: 32 },
  //     { header: 'Path', key: 'path', width: 100 },
  //     { header: 'Level', key: 'level', width: 5 }, 
  //   ];
  //   worksheet.columns = headers;
  
  //   // Format header 
  //   worksheet.getRow(1).font = {
  //     size: 14,
  //     bold: true,
  //   };
  //   worksheet.getRow(1).eachCell((cell) => {
  //     cell.fill = {
  //       type: 'pattern',
  //       pattern: 'solid',
  //       fgColor: { argb: 'F95454' }, // Warna kuning untuk header
  //     };
  //     cell.alignment = { horizontal: 'center' }; // Rata tengah
  //     cell.border = {
  //       top: { style: 'thin' },
  //       left: { style: 'thin' },
  //       bottom: { style: 'thin' },
  //       right: { style: 'thin' },
  //     };
  //   });
  
  //   const whereConditions: string[] = [];

  //   if (category_name) {
  //     whereConditions.push(`category_name ILIKE '%${category_name}%'`);
  //   }

  //   if (levels && levels.length > 0) {
  //     const levelsList = levels.map((level) => `'${level}'`).join(', '); // Format as a comma-separated list
  //     whereConditions.push(`level IN (${levelsList})`);
  //   }

  //   if (path) {
  //       whereConditions.push(`path ILIKE '%${path}%'`);
  //   }

  //   if (search) {
  //     whereConditions.push(`(category_name ILIKE '%${search}%' OR CAST(level AS TEXT) ILIKE '%${search}%' OR path ILIKE '%${search}%' )`);
  //   }

  //   const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  //   // Final query with dynamic filters, order, and pagination
  //   const query = `
  //       WITH RECURSIVE category_hierarchy AS (
  //       SELECT 
  //           category_id,
  //           category_name,
  //           parent_id,
  //           level,
  //           category_name::VARCHAR AS path
  //       FROM category
  //       WHERE parent_id IS NULL
  //       UNION ALL
  //       SELECT 
  //           c.category_id,
  //           c.category_name,
  //           c.parent_id,
  //           c.level,
  //           (ch.path || ' > ' || c.category_name)::VARCHAR AS path
  //       FROM category c
  //       INNER JOIN category_hierarchy ch ON c.parent_id = ch.category_id
  //       )
  //       SELECT * 
  //       FROM category_hierarchy
  //       ${whereClause}
  //       ORDER BY ${orderBy} ${orderDirection}};
  //   `;

  //   const categories = await this.sequelize.query(query, {
  //   type: QueryTypes.SELECT, // Menggunakan QueryTypes yang sudah diimpor
  // }) as { category_name: string; path: string; level: string }[]; // Casting hasil query ke tipe yang diinginkan

  //   // Tambahkan data ke worksheet
  //   categories.forEach((categories, index) => {
  //     worksheet.addRow({
  //       no: index + 1,
  //       // branch_name: categories.parent?.branch_name || '', 
  //       category_name: categories.category_name,
  //       path: categories.path,
  //       level: categories.level,
  //     });
  //   });
  
  //   // Konversi workbook menjadi buffer
  //   const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer;
  //   return buffer;
  // }
}
