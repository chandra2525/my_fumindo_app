import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Asset } from './asset.model';
import { Branch } from '../branch/branch.model';
import { AssetChangeLog } from '../assetChangeLog/assetChangeLog.model';  
import { AssetToolCategory } from '../assetToolCategory/assetToolCategory.model';
import { AssetToolCondition } from '../assetToolCondition/assetToolCondition.model';
import { AssetUnit } from '../assetUnit/assetUnit.model';
import { Op } from 'sequelize'; 
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs'; 

@Injectable()
export class AssetService {
  constructor(
    @InjectModel(Asset) private readonly assetModel: typeof Asset,
    @InjectModel(AssetChangeLog) private readonly assetChangeLogModel: typeof AssetChangeLog, 
  ) {}

  async findAll(
    branchNames?: string[], 
    asset_name?: string,
    assetCategory?: string[], 
    assetToolCategories?: string[],  
    assetToolConditions?: string[], 
    assetUnits?: string[], 
    initial_stock?: string,
    current_stock?: string,  
    orderBy: string = 'asset_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ rows: Asset[]; sp: any }> {
    const whereClause: any = {};
  
    if (asset_name) {
      whereClause.asset_name = { [Op.iLike]: `%${asset_name}%` };  
    }
    if (assetCategory?.length) {
      whereClause.category = { [Op.in]: assetCategory };
    }
    // if (assetToolCategory?.length) {
    //   whereClause.tool_category = { [Op.in]: assetToolCategory };
    // }
    // if (assetToolCondition?.length) {
    //   whereClause.tool_condition = { [Op.in]: assetToolCondition };
    // }
    // if (assetUnit?.length) {
    //   whereClause.unit = { [Op.in]: assetUnit };
    // }
    if (initial_stock) {
      // whereClause.initial_stock = { [Op.iLike]: `%${initial_stock}%` };  
      whereClause.initial_stock = { [Op.eq]: initial_stock }; 
      // whereClause.initial_stock = initial_stock; // Pencarian eksak
    }
    if (current_stock) {
      // whereClause.current_stock = { [Op.iLike]: `%${current_stock}%` };  
      whereClause.current_stock = { [Op.eq]: current_stock }; 
      // whereClause.current_stock = current_stock; // Pencarian eksak
    }

    if (search) {
      whereClause[Op.or] = [
        { asset_name: { [Op.iLike]: `%${search}%` } },
        { category: { [Op.iLike]: `%${search}%` } }, 
        // { tool_category: { [Op.iLike]: `%${search}%` } }, 
        // { tool_condition: { [Op.iLike]: `%${search}%` } },
        // { unit: { [Op.iLike]: `%${search}%` } },
        { '$branch.branch_name$': { [Op.iLike]: `%${search}%` } }, 
        { '$assetToolCategory.tool_category_name$': { [Op.iLike]: `%${search}%` } },
        { '$assetToolCondition.tool_condition_name$': { [Op.iLike]: `%${search}%` } }, 
        { '$assetUnit.unit_name$': { [Op.iLike]: `%${search}%` } }, 
        // Gunakan pencarian angka eksak untuk kolom ini
        ...(isNaN(Number(search))
        ? []
        : [ 
            { initial_stock: { [Op.eq]: Number(search) } },
            { current_stock: { [Op.eq]: Number(search) } },
        ]),
      ];
    }

    // Pagination variables
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
  
    const { rows, count } = await this.assetModel.findAndCountAll({
      include: [
        {
          model: Branch, 
          attributes: ['branch_name'],
          where: branchNames?.length
          ? { branch_name: { [Op.in]: branchNames } }
          : undefined,
        },
        {
          model: AssetToolCategory, 
          attributes: ['tool_category_name'],
          where: assetToolCategories?.length
          ? { tool_category_name: { [Op.in]: assetToolCategories } }
          : undefined,
        },
        {
          model: AssetToolCondition, 
          attributes: ['tool_condition_name'],
          where: assetToolConditions?.length
          ? { tool_condition_name: { [Op.in]: assetToolConditions } }
          : undefined,
        },
        {
          model: AssetUnit, 
          attributes: ['unit_name'],
          where: assetUnits?.length
          ? { unit_name: { [Op.in]: assetUnits } }
          : undefined,
        },
      ],
      where: whereClause,
      order: orderBy === 'branch_name'
      ? [[{ model: Branch, as: 'branch' }, 'branch_name', orderDirection]]
      : orderBy === 'tool_category_name'
      ? [[{ model: AssetToolCategory, as: 'assetToolCategory' }, 'tool_category_name', orderDirection]]
      : orderBy === 'tool_condition_name'
      ? [[{ model: AssetToolCondition, as: 'assetToolCondition' }, 'tool_condition_name', orderDirection]]
      : orderBy === 'unit_name'
      ? [[{ model: AssetUnit, as: 'assetUnit' }, 'unit_name', orderDirection]]
      : [[orderBy, orderDirection]],
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

  async getAssetsCategory(): Promise<string[]> {
    const assetsCategory = await this.assetModel.findAll({
      attributes: ['category'],
    });
    return assetsCategory.map(asset => asset.category);
  }

  // async getAssetsToolCategory(): Promise<string[]> {
  //   const assetsToolCategory = await this.assetModel.findAll({
  //     attributes: ['tool_category'],
  //   });
  //   return assetsToolCategory.map(asset => asset.tool_category);
  // }

  // async getAssetsToolCondition(): Promise<string[]> {
  //   const assetsToolCondition = await this.assetModel.findAll({
  //     attributes: ['tool_condition'],
  //   });
  //   return assetsToolCondition.map(asset => asset.tool_condition);
  // }

  // async getAssetsUnit(): Promise<string[]> {
  //   const assetsUnit = await this.assetModel.findAll({
  //     attributes: ['unit'],
  //   });
  //   return assetsUnit.map(asset => asset.unit);
  // }
  
  async findOne(id: number): Promise<Asset> {
    return this.assetModel.findByPk(id);
  }

  // async create(asset: Asset): Promise<Asset> {
  //   return this.assetModel.create(asset);
  // }

  async create(data: any): Promise<void> {
    const { user_id, branch_id, asset_name, category, initial_stock, current_stock, tool_category_id, tool_condition_id, unit_id } = data;

    // Insert into Asset table and get asset_id
    const assetTable = await this.assetModel.create({
      branch_id,
      asset_name,
      category, 
      initial_stock,
      current_stock,
      tool_category_id,
      tool_condition_id,
      unit_id,
    });

    const asset = await this.assetModel.findByPk(assetTable.asset_id);
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }
    
    const changes: Array<{
      column_name: string;
      value_before: any;
      value_after: any;
    }> = [];

    // Periksa perubahan kolom
    for (const key in data) {
      if (data.hasOwnProperty(key) && asset[key] !== undefined) {
        const oldValue = asset[key];
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
      // await asset.update(data);

      // Catat semua perubahan ke asset_change_log
      for (const change of changes) {
        console.log('Inserting change to log:', change);
        await this.assetChangeLogModel.create({
          // asset_id: assetId,
          asset_id: assetTable.asset_id,
          user_id: data.user_id,
          column_name: change.column_name,
          value_before: change.value_before,
          value_after: change.value_after,
          operation: data.operation,
        });
      }
    // }
  }

  async update(assetId: number, data: any): Promise<void> {
    const asset = await this.assetModel.findByPk(assetId);
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    const changes: Array<{
      column_name: string;
      value_before: any;
      value_after: any;
    }> = [];

    // Periksa perubahan kolom
    for (const key in data) {
      if (data.hasOwnProperty(key) && asset[key] !== undefined) {
        const oldValue = asset[key];
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
      await asset.update(data);

      // Catat semua perubahan ke asset_change_log
      for (const change of changes) {
        console.log('Inserting change to log:', change);
        await this.assetChangeLogModel.create({
          asset_id: assetId,
          user_id: data.user_id, // Pastikan user_id disertakan dalam data
          column_name: change.column_name,
          value_before: change.value_before,
          value_after: change.value_after,
          operation: data.operation,
        });
      }
    }


    // if (asset_name && category) { 
    //   // Use the asset_id to insert into assetChangeLog table
    //   await this.assetChangeLogModel.create({
    //     asset_id: asset.asset_id, // asset_id contains the generated
    //     user_id, 
    //     column_name,
    //     value_before,
    //     value_after,
    //   });
    // }
  }

  async remove(id: number): Promise<void> {
    const asset = await this.findOne(id);
    if (asset) {
      await asset.destroy();
    }
  }

  async importAssets(file: Express.Multer.File): Promise<{ successCount: number; errors: any[] }> {
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
      'Nama Aset': 'asset_name',
      'Kategori': 'category',
      'Kategori Alat': 'tool_category_name',
      'Kondisi Alat': 'tool_condition_name',
      'Satuan': 'unit_name',
      'Stok Awal': 'initial_stock',
      'Stok Saat Ini': 'current_stock', 
      // 'ID Kategori Alat': 'tool_category_id',
      // 'ID Kondisi Alat': 'tool_condition_id',
      // 'ID Unit': 'unit_id',
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

    // Ambil tool_category_name dan tool_category_id dari database
    const toolcategories = await AssetToolCategory.findAll();
    const toolCategoryMap = toolcategories.reduce((map, toolcategory) => {
      map[toolcategory.tool_category_name] = toolcategory.tool_category_id; // Mapping nama ke ID
      return map;
    }, {});

    // Ambil tool_condition_name dan tool_condition_id dari database
    const toolconditions = await AssetToolCondition.findAll();
    const toolConditionMap = toolconditions.reduce((map, toolcondition) => {
      map[toolcondition.tool_condition_name] = toolcondition.tool_condition_id; // Mapping nama ke ID
      return map;
    }, {});
 
    // Ambil unit_name dan unit_id dari database
    const units = await AssetUnit.findAll();
    const unitMap = units.reduce((map, unit) => {
      map[unit.unit_name] = unit.unit_id; // Mapping nama ke ID
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

        // Konversi tool_category_name menjadi tool_category_id
        if (rowData.tool_category_name) {
          rowData.tool_category_id = toolCategoryMap[rowData.tool_category_name];
          if (!rowData.tool_category_id) {
            throw new Error(`Kategori alat "${rowData.tool_category_name}" tidak ditemukan.`);
          }
        } else {
          // Jika tool_category_name kosong, set tool_category_id ke 0
          rowData.tool_category_id = 0;
        }

        // Konversi tool_condition_name menjadi tool_condition_id
        if (rowData.tool_condition_name) {
          rowData.tool_condition_id = toolConditionMap[rowData.tool_condition_name];
          if (!rowData.tool_condition_id) {
            throw new Error(`Kondisi alat "${rowData.tool_condition_name}" tidak ditemukan.`);
          }
        } else {
          // Jika tool_condition_name kosong, set tool_condition_id ke 0
          rowData.tool_condition_id = 0;
        }

        // Konversi unit_name menjadi unit_id
        if (rowData.unit_name) {
          rowData.unit_id = unitMap[rowData.unit_name];
          if (!rowData.unit_id) {
            throw new Error(`Unit "${rowData.unit_name}" tidak ditemukan.`);
          }
        } else {
          // Jika unit_name kosong, set unit_id ke 0
          rowData.unit_id = 0;
        }

        // Validasi data (sesuaikan dengan model Anda) 
        if (!rowData.branch_id ||!rowData.asset_name ||!rowData.category ||!rowData.unit ||!rowData.initial_stock ||!rowData.current_stock) {
          throw new Error('Data tidak valid: kolom "ID Cabang", "Nama Aset", "Kategori", "Kategori Alat", "Kondisi Alat", "Satuan", "Stok Awal", "Stok Saat Ini" diperlukan');
        }
 
        // Simpan data ke database
        await this.assetModel.create(rowData);
        successCount++;
      } catch (error) { 
        errors.push({ row: rowData, error: error.message });
      }
    }

    return { successCount, errors };
  }

  async generateTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template Data Aset');

    // Definisi Header
    const headers = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Nama Cabang', key: 'branch_name', width: 25 },
      { header: 'Nama Aset', key: 'asset_name', width: 39 },
      { header: 'Kategori', key: 'category', width: 32 },
      { header: 'Kategori Alat', key: 'tool_category_name', width: 33 },
      { header: 'Kondisi Alat', key: 'tool_condition_name', width: 33 },
      { header: 'Satuan', key: 'unit_name', width: 13 },
      { header: 'Stok Awal', key: 'initial_stock', width: 21 },
      { header: 'Stok Saat Ini', key: 'current_stock', width: 23 },
      // { header: 'ID Kategori Alat', key: 'tool_category_id', width: 13 },
      // { header: 'ID Kondisi Alat', key: 'tool_condition_id', width: 13 },
      // { header: 'ID Unit', key: 'unit_id', width: 13 },
      // { header: 'Status', key: 'status', width: 30 },
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
      asset_name: 'Isi nama aset, maksimal 100 huruf',
      category: "Isi kategori dengan pilihan 'Bahan', 'Alat'",
      tool_category_name: "Isi kategori alat dengan pilihan 'Peralatan Fumigasi', 'Alat Ukur Fumigasi', 'Peralatan Pest Control', 'Plastic Sheet'",
      tool_condition_name: "Isi kondisi alat dengan pilihan 'Baik', 'Cukup', 'Kurang', 'Rusak'",
      unit_name: "Isi satuan dengan pilihan 'UNIT', 'PCS', 'TABUNG', 'KG', 'GRAM', 'L', 'ML', 'M', 'BUTIR', 'BAG', 'PACK', 'SHEET'",
      initial_stock: "Isi stok awal dengan angka",
      current_stock: "Isi stok saat ini dengan angka",
      // tool_category_id: 3,
      // tool_condition_id: 3,
      // unit_id: 3,
    });

    // Konversi workbook menjadi buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer; // Cast hasil menjadi Buffer
    return buffer;
  }
  
  async exportAssets(
    branchNames?: string[], 
    asset_name?: string,
    assetCategory?: string[], 
    assetToolCategories?: string[],  
    assetToolConditions?: string[], 
    assetUnits?: string[], 
    initial_stock?: string,
    current_stock?: string,  
    orderBy: string = 'asset_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data Aset');
  
    // Header Excel
    const headers = [       
      { header: 'No', key: 'no', width: 5 },
      { header: 'Nama Cabang', key: 'branch_name', width: 25 },
      { header: 'Nama Aset', key: 'asset_name', width: 39 },
      { header: 'Kategori', key: 'category', width: 32 },
      { header: 'Kategori Alat', key: 'tool_category_name', width: 33 },
      { header: 'Kondisi Alat', key: 'tool_condition_name', width: 33 },
      { header: 'Satuan', key: 'unit_name', width: 13 },
      { header: 'Stok Awal', key: 'initial_stock', width: 21 },
      { header: 'Stok Saat Ini', key: 'current_stock', width: 23 },
      // { header: 'ID Kategori Alat', key: 'tool_category_id', width: 13 },
      // { header: 'ID Kondisi Alat', key: 'tool_condition_id', width: 13 },
      // { header: 'ID Unit', key: 'unit_id', width: 13 },
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
  
    if (asset_name) {
      whereClause.asset_name = { [Op.iLike]: `%${asset_name}%` };  
    }
    if (assetCategory?.length) {
      whereClause.category = { [Op.in]: assetCategory };
    }
    // if (assetToolCategory?.length) {
    //   whereClause.tool_category = { [Op.in]: assetToolCategory };
    // }
    // if (assetToolCondition?.length) {
    //   whereClause.tool_condition = { [Op.in]: assetToolCondition };
    // }
    // if (assetUnit?.length) {
    //   whereClause.unit = { [Op.in]: assetUnit };
    // }
    if (initial_stock) {
      // whereClause.initial_stock = { [Op.iLike]: `%${initial_stock}%` };  
      whereClause.initial_stock = { [Op.eq]: initial_stock }; 
      // whereClause.initial_stock = initial_stock; // Pencarian eksak
    }
    if (current_stock) {
      // whereClause.current_stock = { [Op.iLike]: `%${current_stock}%` };  
      whereClause.current_stock = { [Op.eq]: current_stock }; 
      // whereClause.current_stock = current_stock; // Pencarian eksak
    }

    if (search) {
      whereClause[Op.or] = [
        { asset_name: { [Op.iLike]: `%${search}%` } },
        { category: { [Op.iLike]: `%${search}%` } }, 
        // { tool_category: { [Op.iLike]: `%${search}%` } }, 
        // { tool_condition: { [Op.iLike]: `%${search}%` } },
        // { unit: { [Op.iLike]: `%${search}%` } },
        { '$branch.branch_name$': { [Op.iLike]: `%${search}%` } }, 
        { '$assetToolCategory.tool_category_name$': { [Op.iLike]: `%${search}%` } },
        { '$assetToolCondition.tool_condition_name$': { [Op.iLike]: `%${search}%` } },
        { '$assetUnit.unit_name$': { [Op.iLike]: `%${search}%` } }, 
        // Gunakan pencarian angka eksak untuk kolom ini
        ...(isNaN(Number(search))
        ? []
        : [ 
            { initial_stock: { [Op.eq]: Number(search) } },
            { current_stock: { [Op.eq]: Number(search) } },
        ]),
      ];
    }
    
    // Ambil data aset dari database
    const assets = await this.assetModel.findAll({
      include: [
        {
          model: Branch, 
          attributes: ['branch_name'],
          where: branchNames?.length
          ? { branch_name: { [Op.in]: branchNames } }
          : undefined,
        },
        {
          model: AssetToolCategory, 
          attributes: ['tool_category_name'],
          where: assetToolCategories?.length
          ? { tool_category_name: { [Op.in]: assetToolCategories } }
          : undefined,
        },
        {
          model: AssetToolCondition, 
          attributes: ['tool_condition_name'],
          where: assetToolConditions?.length
          ? { tool_condition_name: { [Op.in]: assetToolConditions } }
          : undefined,
        },
        {
          model: AssetUnit, 
          attributes: ['unit_name'],
          where: assetUnits?.length
          ? { unit_name: { [Op.in]: assetUnits } }
          : undefined,
        },
      ],
      where: whereClause,
      order: orderBy === 'branch_name'
      ? [[{ model: Branch, as: 'branch' }, 'branch_name', orderDirection]]
      : orderBy === 'tool_category_name'
      ? [[{ model: AssetToolCategory, as: 'assetToolCategory' }, 'tool_category_name', orderDirection]]
      : orderBy === 'tool_condition_name'
      ? [[{ model: AssetToolCondition, as: 'assetToolCondition' }, 'tool_condition_name', orderDirection]]
      : orderBy === 'unit_name'
      ? [[{ model: AssetUnit, as: 'assetUnit' }, 'unit_name', orderDirection]]
      : [[orderBy, orderDirection]],
      attributes: ['branch_id', 'asset_name', 'category', 'unit', 'initial_stock', 'current_stock', 'tool_category_id', 'tool_condition_id', 'unit_id'], // Kolom yang akan diambil 
    });
  
    // Tambahkan data ke worksheet
    assets.forEach((asset, index) => {
      worksheet.addRow({
        no: index + 1,
        branch_name: asset.branch?.branch_name || '', 
        asset_name: asset.asset_name,
        category: asset.category,
        tool_category_name: asset.assetToolCategory?.tool_category_name || '', 
        tool_condition_name: asset.assetToolCondition?.tool_condition_name || '', 
        unit_name: asset.assetUnit?.unit_name || '',
        initial_stock: asset.initial_stock,
        current_stock: asset.current_stock,
        // tool_category_id: asset.tool_category_id,
        // tool_condition_id: asset.tool_condition_id,
        // unit_id: asset.unit_id,
      });
    });
  
    // Konversi workbook menjadi buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer;
    return buffer;
  }
}
