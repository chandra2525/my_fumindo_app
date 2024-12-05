import { Table, Column, Model, DataType, ForeignKey, BelongsTo  } from 'sequelize-typescript';
import { Branch } from '../branch/branch.model';

// @Table
@Table({ 
  tableName: 'employee',
  timestamps: false  // Menonaktifkan createdAt dan updatedAt
})
export class Employee extends Model<Employee> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  employee_id: number;

  @ForeignKey(() => Branch)
  @Column({ type: DataType.INTEGER })
  branch_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  fullname: string;

  @Column({ type: DataType.STRING })
  phone_number: string;

  @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.STRING })
  address: string;

  @Column({ type: DataType.STRING })
  division: string;

  // @Column({ type: DataType.STRING })
  // role: string;

  @Column({ type: DataType.STRING })
  status: string;

  // @Column({ type: DataType.STRING, unique: true, allowNull: false })
  // username: string;

  // @Column({ type: DataType.STRING, allowNull: false })
  // password: string;

  @BelongsTo(() => Branch)
  branch: Branch;
}

