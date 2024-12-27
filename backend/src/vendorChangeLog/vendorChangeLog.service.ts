import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { VendorChangeLog } from './vendorChangeLog.model';
import { Vendor } from '../vendor/vendor.model';
import { User } from '../users/users.model';
import { QueryTypes } from 'sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript'; // Import Sequelize
import * as moment from 'moment-timezone';
import 'moment/locale/id'; 

@Injectable()
export class VendorChangeLogService {
  constructor(@InjectModel(VendorChangeLog) private vendorChangeLogModel: typeof VendorChangeLog,
  private sequelize: Sequelize ) {}

  async create(data): Promise<VendorChangeLog> {
    return await this.vendorChangeLogModel.create(data);
  }

  async getGroupedLogs(
    vendor_name?: string,
    phone_number?: string,
    username?: string, 
    operation?: string,
    orderBy: string = 'created_at_group',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ rows: any[]; sp: any }> {

    // Pagination variables
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    // TO_CHAR(acl.created_at, 'Dy, DD MonthYYYY, "Jam" HH24:MI:SS') || ' WIB' AS created_at_group,
    // TO_CHAR(acl.created_at, 'Dy, DD Month YYYY, "Jam" HH24:MI:SS') AS created_at_group,
      // Base query with raw SQL
    const query = `
      SELECT 
        TO_CHAR(acl.created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at_group,
        acl.user_id,
        acl.vendor_id,
        a.vendor_name,
        a.phone_number,
        u.username,
        acl.operation
      FROM vendor_change_log acl
      JOIN vendor a ON acl.vendor_id = a.vendor_id
      JOIN "user" u ON acl.user_id = u.user_id
      WHERE 1=1
      ${vendor_name ? `AND a.vendor_name ILIKE :vendor_name` : ''}
      ${phone_number ? `AND a.phone_number ILIKE :phone_number` : ''}
      ${username ? `AND u.username ILIKE :username` : ''}
      ${operation ? `AND acl.operation ILIKE :operation` : ''}
      ${
        search
          ? `AND (
            a.vendor_name ILIKE :search OR 
            a.phone_number ILIKE :search OR 
            u.username ILIKE :search OR 
            CAST(acl.vendor_id AS TEXT) ILIKE :search OR 
            CAST(acl.user_id AS TEXT) ILIKE :search OR
            acl.operation ILIKE :search
          )`
          : ''
      }
      GROUP BY created_at_group, acl.vendor_id, acl.user_id, a.vendor_name, a.phone_number, u.username, acl.operation
      ORDER BY ${orderBy} ${orderDirection}
      LIMIT :limit OFFSET :offset
    `;

    // Count query for total rows (ignoring pagination)
    const countQuery = `
      SELECT COUNT(*) AS "total_count" FROM (
        SELECT 
          TO_CHAR(acl.created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at_group,
          acl.user_id,
          acl.vendor_id,
          a.vendor_name,
          a.phone_number,
          u.username,
          acl.operation
        FROM vendor_change_log acl
        JOIN vendor a ON acl.vendor_id = a.vendor_id
        JOIN "user" u ON acl.user_id = u.user_id
        WHERE 1=1
        ${vendor_name ? `AND a.vendor_name ILIKE :vendor_name` : ''}
        ${phone_number ? `AND a.phone_number ILIKE :phone_number` : ''}
        ${username ? `AND u.username ILIKE :username` : ''}
        ${operation ? `AND acl.operation ILIKE :operation` : ''}
        ${
          search
            ? `AND (
              a.vendor_name ILIKE :search OR 
              a.phone_number ILIKE :search OR 
              u.username ILIKE :search OR 
              CAST(acl.vendor_id AS TEXT) ILIKE :search OR 
              CAST(acl.user_id AS TEXT) ILIKE :search OR
              acl.operation ILIKE :search
            )`
            : ''
        }
        GROUP BY created_at_group, acl.vendor_id, acl.user_id, a.vendor_name, a.phone_number, u.username, acl.operation
      ) AS grouped_logs
    `;

    // Bind replacements for query
    const replacements = {
      vendor_name: vendor_name ? `%${vendor_name}%` : undefined,
      phone_number: phone_number ? `%${phone_number}%` : undefined,
      username: username ? `%${username}%` : undefined,
      // user_id, 
      operation: operation ? `%${operation}%` : undefined,
      search: search ? `%${search}%` : undefined,
      limit,
      offset,
    };
  
    // Execute queries
    const [rows, totalRows] = await Promise.all([
      this.sequelize.query(query, { replacements, type: QueryTypes.SELECT }),
      this.sequelize.query(countQuery, {
        replacements,
        type: QueryTypes.SELECT,
      }),
    ]);


    // Access total count correctly 
    const totalCount = totalRows[0]?.['total_count'] || 0;

    // Pagination info
    const sp = {
      page,
      pageSize,
      pageCount: Math.ceil(totalCount / pageSize),
      rowCount: totalCount,
      // pageCount: Math.ceil(logs.count.length / pageSize), // Count is array length due to grouping
      // rowCount: logs.count.length,
      start: offset,
      limit,
    };

    // return { rows: logs.rows, sp };
    return { rows, sp };
  }

  async findAll(
    vendorNames?: string[],
    userNames?: string[],
    vendorChangeLogColumnName?: string[],
    value_before?: string,
    value_after?: string,
    vendorChangeLogOperation?: string[],
    orderBy: string = 'created_at',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<{ rows: VendorChangeLog[]; sp: any }> {
    const whereClause: any = [];
  
    if (value_before) {
      whereClause.push(`value_before ILIKE '%${value_before}%'`);
    }
    if (value_after) {
      whereClause.push(`value_after ILIKE '%${value_after}%'`);
    }
    if (vendorChangeLogColumnName?.length) {
      const columns = vendorChangeLogColumnName.map((col) => `'${col}'`).join(', ');
      whereClause.push(`column_name IN (${columns})`);
    }
    if (vendorChangeLogOperation?.length) {
      const operations = vendorChangeLogOperation.map((op) => `'${op}'`).join(', ');
      whereClause.push(`operation IN (${operations})`);
    }
    if (search) {
      whereClause.push(
        `(column_name ILIKE '%${search}%' OR 
          value_before ILIKE '%${search}%' OR 
          value_after ILIKE '%${search}%' OR 
          operation ILIKE '%${search}%' OR 
          (SELECT vendor_name FROM vendor WHERE vendor.id = vendor_change_log.vendor_id) ILIKE '%${search}%' OR 
          (SELECT username FROM users WHERE users.id = vendor_change_log.user_id) ILIKE '%${search}%')`
      );
    }
    if (vendorNames?.length) {
      const vendorNamesFilter = vendorNames.map((name) => `'${name}'`).join(', ');
      whereClause.push(
        `(SELECT vendor_name FROM vendor WHERE vendor.id = vendor_change_log.vendor_id) IN (${vendorNamesFilter})`
      );
    }
    if (userNames?.length) {
      const userNamesFilter = userNames.map((name) => `'${name}'`).join(', ');
      whereClause.push(
        `(SELECT username FROM users WHERE users.id = vendor_change_log.user_id) IN (${userNamesFilter})`
      );
    }
  
    // Buat WHERE clause
    const whereSQL = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';
  
    // Pagination
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
  
    // Query raw dengan DISTINCT ON
    const query = `
      SELECT DISTINCT ON (DATE_TRUNC('second', acl.created_at))
          acl.vendor_log_id,
          a.vendor_name,
          u.username,
          acl.operation,
          acl.column_name,
          acl.value_before,
          acl.value_after,
          acl.created_at
      FROM vendor_change_log acl
      FULL JOIN "user" u ON u.user_id = acl.user_id
      JOIN vendor a ON a.vendor_id = acl.vendor_id
      ${whereSQL}
      ORDER BY DATE_TRUNC('second', acl.created_at) DESC
      LIMIT ${limit} OFFSET ${offset};
    `;
  
    // Jalankan query
    const rows = await this.sequelize.query<VendorChangeLog>(query, {
      model: VendorChangeLog,
      mapToModel: true,
    });

    rows.forEach((row) => {
      row.created_at = moment(row.created_at)
        .locale('id') // Atur locale ke bahasa Indonesia
        .tz('Asia/Jakarta')
        .format("dddd, DD MMMM YYYY, [Jam] HH:mm:ss [WIB]") as any;
    });
  
    interface CountResult {
      count: number;
    }

    // Hitung jumlah total
    const countQuery = ` 
      SELECT COUNT(DISTINCT (DATE_TRUNC('second', created_at))) AS count
      FROM vendor_change_log
      ${whereSQL};
    `;
    const countResult = await this.sequelize.query<CountResult>(countQuery, { type: QueryTypes.SELECT });
    const count = countResult[0]?.count ?? 0;
  
    // Pagination metadata
    const sp = {
      page,
      pageSize,
      pageCount: Math.ceil(count / pageSize),
      rowCount: count,
      start: offset,
      limit: rows.length,
    };
  
    return { rows, sp };
  }
  
  

  // Method baru untuk query SQL DISTINCT ON (vendor_id)
  async findLatestChangeLogs(): Promise<VendorChangeLog[]> {
    const query = `
      SELECT DISTINCT ON (vendor_id)
          vendor_log_id,
          vendor_id, 
          user_id, 
          operation,
          created_at
      FROM 
          vendor_change_log
      ORDER BY 
          vendor_id, 
          created_at;
    `;
  
    const results = await this.sequelize.query<VendorChangeLog>(query, {
      model: VendorChangeLog, // Mapping hasil ke model VendorChangeLog
      mapToModel: true, // Aktifkan mapping
    });
  
    // Type assertion untuk memastikan hasil adalah array
    return results as VendorChangeLog[];
  }
  
  // Menampilkan semua data vendor
  async getAllVendors() {
    return this.vendorChangeLogModel.findAll();
  }

  async getVendorChangeLogsColumnName(): Promise<string[]> {
    const vendorChangeLogsColumnName = await this.vendorChangeLogModel.findAll({
      attributes: ['column_name'],
    });
    return vendorChangeLogsColumnName.map(vendorChangeLog => vendorChangeLog.column_name);
  }

  async getVendorChangeLogsOperation(): Promise<string[]> {
    const vendorChangeLogsOperation = await this.vendorChangeLogModel.findAll({
      attributes: ['operation'],
    });
    return vendorChangeLogsOperation.map(vendorChangeLog => vendorChangeLog.operation);
  }

  async findOne(id: number): Promise<VendorChangeLog> {
    return await this.vendorChangeLogModel.findByPk(id);
  }
  

  // async update(id: number, data): Promise<[number, VendorChangeLog[]]> {
  //   return await this.vendorChangeLogModel.update(data, {
  //     where: { vendor_log_id: id },
  //     returning: true, // Menambahkan opsi ini untuk mengembalikan data yang diperbarui
  //   });
  // }
  
  // async remove(id: number): Promise<void> {
  //   await this.vendorChangeLogModel.destroy({ where: { vendor_log_id: id } });
  // }
 
}
