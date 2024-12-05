import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Asset } from '../asset/asset.model';

// @Table
@Table({ 
  tableName: 'tool_category',
  timestamps: false  // Menonaktifkan createdAt dan updatedAt
})
export class AssetToolCategory extends Model<AssetToolCategory> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  tool_category_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  tool_category_name: string;

  @HasMany(() => Asset)
  asset: Asset[];
}

