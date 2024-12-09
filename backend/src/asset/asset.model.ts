import { Table, Column, Model, DataType, ForeignKey, BelongsTo  } from 'sequelize-typescript';
import { Branch } from '../branch/branch.model';
import { AssetToolCategory } from '../assetToolCategory/assetToolCategory.model';
import { AssetToolCondition } from '../assetToolCondition/assetToolCondition.model';
import { AssetUnit } from '../assetUnit/assetUnit.model';


// @Table
@Table({ 
  tableName: 'asset',
  timestamps: false  // Menonaktifkan createdAt dan updatedAt
})
export class Asset extends Model<Asset> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  asset_id: number;

  @ForeignKey(() => Branch)
  @Column({ type: DataType.INTEGER })
  branch_id: number;
  
  @ForeignKey(() => AssetToolCategory)
  @Column({ type: DataType.INTEGER, allowNull: true })
  tool_category_id: number;
  
  @ForeignKey(() => AssetToolCondition)
  @Column({ type: DataType.INTEGER })
  tool_condition_id: number;

  @ForeignKey(() => AssetUnit)
  @Column({ type: DataType.INTEGER })
  unit_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  asset_name: string;

  @Column({ type: DataType.STRING })
  category: string;

  // @Column({ type: DataType.STRING })
  // tool_category: string;

  // @Column({ type: DataType.STRING })
  // tool_condition: string;

  // @Column({ type: DataType.STRING })
  // unit: string;

  @Column({ type: DataType.INTEGER })
  initial_stock: number;

  @Column({ type: DataType.INTEGER })
  current_stock: number;

  @BelongsTo(() => Branch)
  branch: Branch;

  @BelongsTo(() => AssetToolCategory)
  assetToolCategory: AssetToolCategory;

  @BelongsTo(() => AssetToolCondition)
  assetToolCondition: AssetToolCondition;

  @BelongsTo(() => AssetUnit)
  assetUnit: AssetUnit;

}

