import { Table, Column, Model, DataType, ForeignKey, BelongsTo  } from 'sequelize-typescript';
import { Vendor } from '../vendor/vendor.model';
import { User } from '../users/users.model';

// @Table
@Table({ 
  tableName: 'vendor_change_log',
  timestamps: false  // Menonaktifkan createdAt dan updatedAt
})
export class VendorChangeLog extends Model<VendorChangeLog> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  vendor_log_id: number;

  @ForeignKey(() => Vendor)
  @Column({ type: DataType.INTEGER, allowNull: true })
  vendor_id: number;

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

  @BelongsTo(() => Vendor)
  vendor: Vendor;

  @BelongsTo(() => User)
  user: User;
}

