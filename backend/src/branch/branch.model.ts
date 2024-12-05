import { Table, Column, Model, DataType, HasMany  } from 'sequelize-typescript';
import { Employee } from '../employee/employee.model'; 

// @Table
@Table({ 
  tableName: 'branch', 
  timestamps: false  // Menonaktifkan createdAt dan updatedAt
})
export class Branch extends Model<Branch> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  branch_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  branch_name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  address: string;

  @HasMany(() => Employee)
  employee: Employee[];
}
