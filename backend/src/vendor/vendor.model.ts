import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { VendorChangeLog } from 'src/vendorChangeLog/vendorChangeLog.model';
import { SkuItem } from '../skuItem/skuItem.model';
 
// @Table
@Table({ 
  tableName: 'vendor',
  timestamps: false  // Menonaktifkan createdAt dan updatedAt
})
export class Vendor extends Model<Vendor> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  vendor_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  vendor_name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  phone_number: string;

  @Column({ type: DataType.STRING, allowNull: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: true })
  address: string;

  @Column({ type: DataType.STRING, allowNull: true })
  upcoming_review_date: string;

  @Column({ type: DataType.STRING, allowNull: true })
  vendor_remark: string;

  @Column({ type: DataType.STRING, allowNull: false })
  vendor_status: string;

  @HasMany(() => VendorChangeLog)
  vendorChangeLog: VendorChangeLog[];
  
  @HasMany(() => SkuItem)
  skuItem: SkuItem[];
}

