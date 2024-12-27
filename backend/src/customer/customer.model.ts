import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
 

// @Table
@Table({ 
  tableName: 'customer',
  timestamps: false  // Menonaktifkan createdAt dan updatedAt
})
export class Customer extends Model<Customer> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  customer_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  customer_name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  phone_number: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  address: string;
}

