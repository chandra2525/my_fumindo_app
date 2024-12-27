import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { SkuType } from 'src/skuType/skuType.model';

@Table({ 
    tableName: 'category',
    timestamps: false  // Menonaktifkan createdAt dan updatedAt
})
export class Category extends Model<Category> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  category_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  category_name: string;

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER, allowNull: true })
  parent_id: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  level: number;
  
  @BelongsTo(() => Category)
  parent: Category;

  @HasMany(() => Category)
  children: Category[];
  
  @HasMany(() => SkuType, { as: 'skuType' })
  skuType: SkuType[];
}
