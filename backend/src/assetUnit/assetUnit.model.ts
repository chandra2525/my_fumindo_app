import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Asset } from '../asset/asset.model';
import { SkuItem } from '../skuItem/skuItem.model';

// @Table
@Table({ 
  tableName: 'unit',
  timestamps: false  // Menonaktifkan createdAt dan updatedAt
})
export class AssetUnit extends Model<AssetUnit> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  unit_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  unit_name: string;

  @HasMany(() => Asset)
  asset: Asset[];

  @HasMany(() => SkuItem)
  skuItem: SkuItem[];
}

