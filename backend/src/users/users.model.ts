import { Table, Column, Model, DataType, ForeignKey, BelongsTo  } from 'sequelize-typescript';
import { Employee } from '../employee/employee.model';

// @Table
@Table({ 
  tableName: 'user',
  timestamps: false  // Menonaktifkan createdAt dan updatedAt
})
export class User extends Model<User> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  user_id: number;

  @ForeignKey(() => Employee)
  @Column({ type: DataType.INTEGER, allowNull: true  })
  employee_id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  username: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING })
  type_user: string;

  @Column({ type: DataType.STRING })
  role: string;

  @BelongsTo(() => Employee)
  employee: Employee;
}

