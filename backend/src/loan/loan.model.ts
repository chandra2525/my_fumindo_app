import { Table, Column, Model, DataType, HasMany  } from 'sequelize-typescript';
import { LoanAsset } from 'src/loanAsset/loanAsset.model'; 

// @Table
@Table({ 
  tableName: 'loan', 
  timestamps: false  // Menonaktifkan createdAt dan updatedAt
})
export class Loan extends Model<Loan> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  loan_id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  customer_name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  notes: string;
 
  @HasMany(() => LoanAsset)
  loanAsset: LoanAsset[];
}
