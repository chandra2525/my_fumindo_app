import { Table, Column, Model, DataType, ForeignKey, BelongsTo  } from 'sequelize-typescript';
import { Asset } from '../asset/asset.model';
import { User } from '../users/users.model';

// @Table
@Table({ 
  tableName: 'asset_change_log',
  timestamps: false  // Menonaktifkan createdAt dan updatedAt
})
export class AssetChangeLog extends Model<AssetChangeLog> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  asset_log_id: number;

  @ForeignKey(() => Asset)
  @Column({ type: DataType.INTEGER, allowNull: true })
  asset_id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  user_id: number;

  @Column({ type: DataType.STRING, allowNull: true })
  column_name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  value_before: string;

  @Column({ type: DataType.STRING, allowNull: true })
  value_after: string; 

  @Column({ type: DataType.STRING, allowNull: true })
  operation: string; 

  @Column({ type: DataType.STRING, allowNull: true })
  created_at: string;

  @BelongsTo(() => Asset)
  asset: Asset;

  @BelongsTo(() => User)
  user: User;
}

