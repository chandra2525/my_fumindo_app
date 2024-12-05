import { Table, Column, Model, DataType } from 'sequelize-typescript';
  
@Table({ 
    tableName: 'blacklist_tokens', 
    timestamps: false
 })
export class BlacklistToken extends Model<BlacklistToken> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id_blacklist_token: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  token: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expired_at: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  created_at: Date;
}
