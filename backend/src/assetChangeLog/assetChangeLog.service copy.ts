import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AssetChangeLog } from './assetChangeLog.model';
import { Asset } from '../asset/asset.model';
import { User } from '../users/users.model';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript'; // Import Sequelize
@Injectable()
export class AssetChangeLogService {
  constructor(@InjectModel(AssetChangeLog) private assetChangeLogModel: typeof AssetChangeLog,
  private sequelize: Sequelize ) {}

  async create(data): Promise<AssetChangeLog> {
    return await this.assetChangeLogModel.create(data);
  }

  async findAll(
    assetNames?: string[], 
    userNames?: string[],  
    assetChangeLogColumnName?: string[],  
    value_before?: string,
    value_after?: string,
    assetChangeLogOperation?: string[],  
    orderBy: string = 'asset_log_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ rows: AssetChangeLog[]; sp: any }> {
    const whereClause: any = {};
  
    if (value_before) {
      whereClause.value_before = { [Op.iLike]: `%${value_before}%` };  
    }
    if (value_after) {
      whereClause.value_after = { [Op.iLike]: `%${value_after}%` };  
    }
    if (assetChangeLogColumnName?.length) {
      whereClause.column_name = { [Op.in]: assetChangeLogColumnName };
    }
    if (assetChangeLogOperation?.length) {
      whereClause.operation = { [Op.in]: assetChangeLogOperation };
    }

    if (search) {
      whereClause[Op.or] = [
        { column_name: { [Op.iLike]: `%${search}%` } },
        { value_before: { [Op.iLike]: `%${search}%` } },
        { value_after: { [Op.iLike]: `%${search}%` } }, 
        { operation: { [Op.iLike]: `%${search}%` } }, 
        { '$asset.asset_name$': { [Op.iLike]: `%${search}%` } }, 
        { '$user.username$': { [Op.iLike]: `%${search}%` } }, 
      ];
    }

    // return this.assetChangeLogModel.findAll({
    //   include: [
    //     {
    //       model: Asset, // Model asset
    //       attributes: ['asset_name'], // Hanya mengambil nama cabang
    //       where: assetNames?.length
    //       ? { asset_name: { [Op.in]: assetNames } } // Filter asset_name jika diberikan
    //       : undefined, // Jika tidak ada filter asset_name, jangan tambahkan where
    //     },
    //   ],
    //   where: whereClause,
    //   // order: [[orderBy, orderDirection]], 
    //   order: orderBy === 'asset_name' // Cek jika sorting berdasarkan asset_name
    //   ? [[{ model: Asset, as: 'asset' }, 'asset_name', orderDirection]] // Sorting berdasarkan asset_name
    //   : [[orderBy, orderDirection]], // Sorting default (asset_log_id)
    // });

    // Pagination variables
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const { rows, count } = await this.assetChangeLogModel.findAndCountAll({
      include: [
        {
          model: Asset, // Model asset
          attributes: ['asset_name'], // Hanya mengambil nama cabang
          where: assetNames?.length
          ? { asset_name: { [Op.in]: assetNames } } // Filter asset_name jika diberikan
          : undefined, // Jika tidak ada filter asset_name, jangan tambahkan where
        },
        {
          model: User, // Model user
          attributes: ['username'], // Hanya mengambil nama cabang
          where: userNames?.length
          ? { username: { [Op.in]: userNames } } // Filter username jika diberikan
          : undefined, // Jika tidak ada filter username, jangan tambahkan where
        },
      ],
      where: whereClause, 
      order: orderBy === 'asset_name' // Cek jika sorting berdasarkan asset_name
      ? [[{ model: Asset, as: 'asset' }, 'asset_name', orderDirection]] // Sorting berdasarkan asset_name
      :orderBy === 'username' // Cek jika sorting berdasarkan username
      ? [[{ model: User, as: 'user' }, 'username', orderDirection]] // Sorting berdasarkan asset_name
      : [[orderBy, orderDirection]], // Sorting default (asset_log_id)
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
