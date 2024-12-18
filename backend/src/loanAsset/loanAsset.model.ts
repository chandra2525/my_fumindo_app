import { Table, Column, Model, ForeignKey, DataType, BelongsTo  } from 'sequelize-typescript';
import { Asset } from 'src/asset/asset.model';
import { Loan } from 'src/loan/loan.model';
// import { Employee } from '../employee/employee.model'; 

// @Table
@Table({ 
  tableName: 'loan_asset', 
  timestamps: false  // Menonaktifkan createdAt dan updatedAt
})
export class LoanAsset extends Model<LoanAsset> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  loan_asset_id: number;

  @ForeignKey(() => Loan)
  @Column({ type: DataType.INTEGER })
  loan_id: number;

  @ForeignKey(() => Asset)
  @Column({ type: DataType.INTEGER })
  asset_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  input_method: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  quantity: number; 

  @BelongsTo(() => Loan)
  loan: Loan;

  @BelongsTo(() => Asset)
  asset: Asset;
}
