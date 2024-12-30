import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AssetChangeLog } from './assetChangeLog.model';
import { Asset } from '../asset/asset.model';
import { User } from '../users/users.model';
import { QueryTypes } from 'sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript'; // Import Sequelize
import * as moment from 'moment-timezone';
import 'moment/locale/id'; 

@Injectable()
export class AssetChangeLogService {
  constructor(
    @InjectModel(AssetChangeLog)
    private assetChangeLogModel: typeof AssetChangeLog,
    private sequelize: Sequelize,
  ) {}

  async create(data): Promise<AssetChangeLog> {
    return await this.assetChangeLogModel.create(data);
  }

  async getGroupedLogs(
    asset_name?: string,
    category?: string,
    username?: string, 
    operation?: string,
    orderBy: string = 'created_at_group',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ rows: any[]; sp: any }> {
    // const whereClause: any = {};

    // // Filter by asset_id
    // if (asset_id) {
    //   whereClause.asset_id = asset_id;
    // }

    // // Filter by operation
    // if (operation) {
    //   whereClause.operation = { [Op.iLike]: `%${operation}%` };  
    // }

    // // Search by multiple columns
    // if (search) {
    //   whereClause[Op.or] = [
    //     { asset_id: { [Op.eq]: search } },
    //     { operation: { [Op.iLike]: `%${search}%` } },
    //   ];
    // }

    // Pagination variables
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    // const logs = await this.assetChangeLogModel.findAndCountAll({
    //   attributes: [
    //     [this.sequelize.fn('to_char', this.sequelize.col('created_at'), 'DD-MM-YYYY HH24:MI:SS'), 'created_at_group'],
    //     'asset_id',
    //     'operation',
    //   ],
    //   where: whereClause,
    //   group: ['created_at_group', 'asset_id', 'operation'],
    //   order: [[this.sequelize.col(orderBy), orderDirection]],
    //   // order: [[this.sequelize.fn('to_char', this.sequelize.col('created_at'), 'DD-MM-YYYY HH24:MI:SS'), 'ASC']],
    //   offset,
    //   limit,
    //   raw: true,
    // });

    // TO_CHAR(acl.created_at, 'Dy, DD MonthYYYY, "Jam" HH24:MI:SS') || ' WIB' AS created_at_group,
    // TO_CHAR(acl.created_at, 'Dy, DD Month YYYY, "Jam" HH24:MI:SS') AS created_at_group,
      // Base query with raw SQL
    const query = `
      SELECT 
        TO_CHAR(acl.created_at, 'DD-MM-YYYY HH24:MI:SS') AS created_at_group,
        acl.user_id,
        acl.asset_id,
        a.asset_name,
        a.category,
        u.username,
        acl.operation
      FROM asset_change_log acl
      JOIN asset a ON acl.asset_id = a.asset_id
      JOIN "user" u ON acl.user_id = u.user_id
      WHERE 1=1
      ${asset_name ? `AND a.asset_name ILIKE :asset_name` : ''}
      ${category ? `AND a.category ILIKE :category` : ''}
      ${username ? `AND u.username ILIKE :username` : ''}
      ${operation ? `AND acl.operation ILIKE :operation` : ''}
      ${
        search
          ? `AND (
            a.asset_name ILIKE :search OR 
            a.category ILIKE :search OR 
            u.username ILIKE :search OR 
            CAST(acl.asset_id AS TEXT) ILIKE :search OR 
            CAST(acl.user_id AS TEXT) ILIKE :search OR
            acl.operation ILIKE :search
          )`
          : ''
      }
      GROUP BY created_at_group, acl.asset_id, acl.user_id, a.asset_name, a.category, u.username, acl.operation
      ORDER BY ${orderBy} ${orderDirection}
      LIMIT :limit OFFSET :offset
    `;

    // Count query for total rows (ignoring pagination)
    const countQuery = `
      SELECT COUNT(*) AS "total_count" FROM (
        SELECT 
          TO_CHAR(acl.created_at, 'DD-MM-YYYY HH24:MI:SS') AS created_at_group,
          acl.user_id,
          acl.asset_id,
          a.asset_name,
          a.category,
          u.username,
          acl.operation
        FROM asset_change_log acl
        JOIN asset a ON acl.asset_id = a.asset_id
        JOIN "user" u ON acl.user_id = u.user_id
        WHERE 1=1
        ${asset_name ? `AND a.asset_name ILIKE :asset_name` : ''}
        ${category ? `AND a.category ILIKE :category` : ''}
        ${username ? `AND u.username ILIKE :username` : ''}
        ${operation ? `AND acl.operation ILIKE :operation` : ''}
        ${
          search
            ? `AND (
              a.asset_name ILIKE :search OR 
              a.category ILIKE :search OR 
              u.username ILIKE :search OR 
              CAST(acl.asset_id AS TEXT) ILIKE :search OR 
              CAST(acl.user_id AS TEXT) ILIKE :search OR
              acl.operation ILIKE :search
            )`
            : ''
        }
        GROUP BY created_at_group, acl.asset_id, acl.user_id, a.asset_name, a.category, u.username, acl.operation
      ) AS grouped_logs
    `;

    // Bind replacements for query
    const replacements = {
      asset_name: asset_name ? `%${asset_name}%` : undefined,
      category: category ? `%${category}%` : undefined,
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
    // return logs;


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
    assetNames?: string[],
    userNames?: string[],
    assetChangeLogColumnName?: string[],
    value_before?: string,
    value_after?: string,
    assetChangeLogOperation?: string[],
    orderBy: string = 'created_at',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<{ rows: AssetChangeLog[]; sp: any }> {
    const whereClause: any = [];
  
    if (value_before) {
      whereClause.push(`value_before ILIKE '%${value_before}%'`);
    }
    if (value_after) {
      whereClause.push(`value_after ILIKE '%${value_after}%'`);
    }
    if (assetChangeLogColumnName?.length) {
      const columns = assetChangeLogColumnName.map((col) => `'${col}'`).join(', ');
      whereClause.push(`column_name IN (${columns})`);
    }
    if (assetChangeLogOperation?.length) {
      const operations = assetChangeLogOperation.map((op) => `'${op}'`).join(', ');
      whereClause.push(`operation IN (${operations})`);
    }
    if (search) {
      whereClause.push(
        `(column_name ILIKE '%${search}%' OR 
          value_before ILIKE '%${search}%' OR 
          value_after ILIKE '%${search}%' OR 
          operation ILIKE '%${search}%' OR 
          (SELECT asset_name FROM asset WHERE asset.asset_id = asset_change_log.asset_id) ILIKE '%${search}%' OR 
          (SELECT username FROM user WHERE user.user_id = asset_change_log.user_id) ILIKE '%${search}%')`
      );
    }
    if (assetNames?.length) {
      const assetNamesFilter = assetNames.map((name) => `'${name}'`).join(', ');
      whereClause.push(
        `(SELECT asset_name FROM asset WHERE asset.asset_id = asset_change_log.asset_id) IN (${assetNamesFilter})`
      );
    }
    if (userNames?.length) {
      const userNamesFilter = userNames.map((name) => `'${name}'`).join(', ');
      whereClause.push(
        `(SELECT username FROM user WHERE user.user_id = asset_change_log.user_id) IN (${userNamesFilter})`
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
          acl.asset_log_id,
          a.asset_name,
          u.username,
          acl.operation,
          acl.column_name,
          acl.value_before,
          acl.value_after,
          acl.created_at
      FROM asset_change_log acl
      FULL JOIN "user" u ON u.user_id = acl.user_id
      JOIN asset a ON a.asset_id = acl.asset_id
      ${whereSQL}
      ORDER BY DATE_TRUNC('second', acl.created_at) DESC
      LIMIT ${limit} OFFSET ${offset};
    `;
  
    // Jalankan query
    const rows = await this.sequelize.query<AssetChangeLog>(query, {
      model: AssetChangeLog,
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
      FROM asset_change_log
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
  
  

  // Method baru untuk query SQL DISTINCT ON (asset_id)
  async findLatestChangeLogs(): Promise<AssetChangeLog[]> {
    const query = `
      SELECT DISTINCT ON (asset_id)
          asset_log_id,
          asset_id, 
          user_id, 
          operation,
          created_at
      FROM 
          asset_change_log
      ORDER BY 
          asset_id, 
          created_at;
    `;
  
    const results = await this.sequelize.query<AssetChangeLog>(query, {
      model: AssetChangeLog, // Mapping hasil ke model AssetChangeLog
      mapToModel: true, // Aktifkan mapping
    });
  
    // Type assertion untuk memastikan hasil adalah array
    return results as AssetChangeLog[];
  }
  

  async getAssetChangeLogsColumnName(): Promise<string[]> {
    const assetChangeLogsColumnName = await this.assetChangeLogModel.findAll({
      attributes: ['column_name'],
    });
    return assetChangeLogsColumnName.map(assetChangeLog => assetChangeLog.column_name);
  }

  async getAssetChangeLogsOperation(): Promise<string[]> {
    const assetChangeLogsOperation = await this.assetChangeLogModel.findAll({
      attributes: ['operation'],
    });
    return assetChangeLogsOperation.map(assetChangeLog => assetChangeLog.operation);
  }

  async findOne(id: number): Promise<AssetChangeLog> {
    return await this.assetChangeLogModel.findByPk(id);
  }
  

  // async update(id: number, data): Promise<[number, AssetChangeLog[]]> {
  //   return await this.assetChangeLogModel.update(data, {
  //     where: { asset_log_id: id },
  //     returning: true, // Menambahkan opsi ini untuk mengembalikan data yang diperbarui
  //   });
  // }
  
  // async remove(id: number): Promise<void> {
  //   await this.assetChangeLogModel.destroy({ where: { asset_log_id: id } });
  // }
 
}
