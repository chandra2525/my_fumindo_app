import { Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { LoanAsset } from 'src/loanAsset/loanAsset.model';
import { User } from 'src/users/users.model';

// @Table
@Table({
  tableName: 'loan',
  timestamps: false  // Menonaktifkan createdAt dan updatedAt
})
export class Loan extends Model<Loan> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  loan_id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  user_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  customer_name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  notes: string;

  @Column({ type: DataType.STRING, allowNull: false })
  status: string;

  @Column({ type: DataType.STRING, allowNull: true })
  loan_date: string;

  @HasMany(() => LoanAsset)
  loanAsset: LoanAsset[];

  @BelongsTo(() => User)
  user: User;
}
