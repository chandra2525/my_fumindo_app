import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { SkuType } from '../skuType/skuType.model';
import { AssetUnit } from '../assetUnit/assetUnit.model';
import { Vendor } from '../vendor/vendor.model';

// @Table
@Table({
  tableName: 'sku_item',
  timestamps: false  // Menonaktifkan createdAt dan updatedAt
})
export class SkuItem extends Model<SkuItem> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  sku_item_id: number;

  @ForeignKey(() => SkuType)
  @Column({ type: DataType.INTEGER, allowNull: false })
  sku_type_id: number;

  @ForeignKey(() => AssetUnit)
  @Column({ type: DataType.INTEGER, allowNull: false })
  unit_id: number;

  @ForeignKey(() => Vendor)
  @Column({ type: DataType.INTEGER, allowNull: false })
  vendor_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  sku_item_name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  brand: string;
  
  @Column({ type: DataType.REAL, allowNull: true })
  length: number;
  
  @Column({ type: DataType.REAL, allowNull: true })
  width: number;
  
  @Column({ type: DataType.REAL, allowNull: true })
  height: number;
  
  @Column({ type: DataType.REAL, allowNull: true })
  weight: number;
  
  @Column({ type: DataType.INTEGER, allowNull: true })
  price: number;
  
  @Column({ type: DataType.STRING, allowNull: true })
  consumed: string;

  @BelongsTo(() => SkuType)
  skuType: SkuType;

  @BelongsTo(() => AssetUnit)
  assetUnit: AssetUnit;

  @BelongsTo(() => Vendor)
  vendor: Vendor;
}