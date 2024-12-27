import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Branch } from '../branch/branch.model'; 

// @Table
@Table({
  tableName: 'warehouse',
  timestamps: false  // Menonaktifkan createdAt dan updatedAt
})
export class Warehouse extends Model<Warehouse> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  warehouse_id: number;

  @ForeignKey(() => Branch)
  @Column({ type: DataType.INTEGER, allowNull: false })
  branch_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  warehouse_name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  address: string;

  @BelongsTo(() => Branch)
  branch: Branch;
}