import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Asset } from '../asset/asset.model';

// @Table
@Table({ 
  tableName: 'tool_condition',
  timestamps: false  // Menonaktifkan createdAt dan updatedAt
})
export class AssetToolCondition extends Model<AssetToolCondition> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  tool_condition_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  tool_condition_name: string;

  @HasMany(() => Asset)
  asset: Asset[];
}

