import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Warehouse } from '../warehouse/warehouse.model';
import { Vendor } from '../vendor/vendor.model';
import { User } from '../users/users.model'; 
import { PurchaseInboundItem } from '../purchaseInboundItem/purchaseInboundItem.model';
// import { SkuItem } from '../skuItem/skuItem.model';

// @Table
@Table({
  tableName: 'purchase_inbound',
  timestamps: false  // Menonaktifkan createdAt dan updatedAt
})
export class PurchaseInbound extends Model<PurchaseInbound> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  purchase_inbound_id: number;

  @ForeignKey(() => Warehouse)
  @Column({ type: DataType.INTEGER, allowNull: true })
  warehouse_id: number;

  @ForeignKey(() => Vendor)
  @Column({ type: DataType.INTEGER, allowNull: true })
  vendor_id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  user_id: number;

  // @ForeignKey(() => SkuItem)
  // @Column({ type: DataType.INTEGER, allowNull: true })
  // sku_item_id: number;

  @Column({ type: DataType.STRING, allowNull: true })
  inventory_type: string;

  @Column({ type: DataType.STRING, allowNull: true })
  purchase_order_number: string;
  
  @Column({ type: DataType.STRING, allowNull: true })
  expected_inbound_date: string;
  
  @Column({ type: DataType.STRING, allowNull: true })
  actual_inbound_date: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  inbound_by: number;

  @Column({ type: DataType.STRING, allowNull: true })
  asn: string;
  
  // @Column({ type: DataType.INTEGER, allowNull: true })
  // expected_quantity: number;
  
  @Column({ type: DataType.STRING, allowNull: true })
  status: string;

  @Column({ type: DataType.STRING, allowNull: true })
  create_date: Date;

  @Column({ type: DataType.STRING, allowNull: true })
  update_date: string;

  @BelongsTo(() => Warehouse)
  warehouse: Warehouse;

  @BelongsTo(() => Vendor)
  vendor: Vendor;

  @BelongsTo(() => User)
  user: User;
  
  @HasMany(() => PurchaseInboundItem)
  items: PurchaseInboundItem[];
  
  // @BelongsTo(() => SkuItem)
  // skuItem: SkuItem;
}