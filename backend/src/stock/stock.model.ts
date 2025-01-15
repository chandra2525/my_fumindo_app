import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { SkuItem } from '../skuItem/skuItem.model';
import { Branch } from '../branch/branch.model';
import { Warehouse } from '../warehouse/warehouse.model';

// @Table
@Table({
  tableName: 'stock',
  timestamps: false  // Menonaktifkan createdAt dan updatedAt
})
export class Stock  extends Model<Stock > {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  stock_id: number;
  
  @ForeignKey(() => SkuItem)
  @Column({ type: DataType.INTEGER, allowNull: true })
  sku_item_id: number;

  @ForeignKey(() => Branch)
  @Column({ type: DataType.INTEGER, allowNull: true })
  branch_id: number;

  @ForeignKey(() => Warehouse)
  @Column({ type: DataType.INTEGER, allowNull: true })
  warehouse_id: number;
  
  @Column({ type: DataType.DOUBLE, allowNull: true })
  stock_quantity: number;

  @BelongsTo(() => SkuItem)
  skuItem: SkuItem;

  @BelongsTo(() => Branch)
  branch: Branch;

  @BelongsTo(() => Warehouse)
  warehouse: Warehouse;
}