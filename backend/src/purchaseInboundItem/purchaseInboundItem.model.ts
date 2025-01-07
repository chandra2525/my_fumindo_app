import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { SkuItem } from '../skuItem/skuItem.model';
import { PurchaseInbound } from '../purchaseInbound/purchaseInbound.model';

// @Table
@Table({
  tableName: 'purchase_inbound_item',
  timestamps: false  // Menonaktifkan createdAt dan updatedAt
})
export class PurchaseInboundItem  extends Model<PurchaseInboundItem > {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  purchase_inbound_item_id: number;

  @ForeignKey(() => PurchaseInbound)
  @Column({ type: DataType.INTEGER, allowNull: true })
  purchase_inbound_id: number;
  
  @ForeignKey(() => SkuItem)
  @Column({ type: DataType.INTEGER, allowNull: true })
  sku_item_id: number;
  
  @Column({ type: DataType.INTEGER, allowNull: true })
  current_price: number;
  
  @Column({ type: DataType.DOUBLE, allowNull: true })
  expected_quantity: number;
  
  @Column({ type: DataType.DOUBLE, allowNull: true })
  actual_quantity: number;

  @Column({ type: DataType.STRING, allowNull: true })
  actual_inbound_item_date: string;

  @BelongsTo(() => PurchaseInbound)
  purchaseInbound: PurchaseInbound;

  @BelongsTo(() => SkuItem)
  skuItem: SkuItem;
}