import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Category } from '../category/category.model';
import { SkuItem } from '../skuItem/skuItem.model';

// @Table
@Table({
  tableName: 'sku_type',
  timestamps: false  // Menonaktifkan createdAt dan updatedAt
})
export class SkuType extends Model<SkuType> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  sku_type_id: number;

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER, allowNull: false })
  category_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  sku_type_name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  sku_type_code: string;

  @BelongsTo(() => Category)
  category: Category;
  
  @HasMany(() => SkuItem)
  skuItem: SkuItem[];
}