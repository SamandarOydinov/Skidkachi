import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Discount } from "../../discount/models/discount.model";

interface ICategoryCreationAttr{
    name: string;
    description: string;
    parent_category_id: number;
}

@Table({ tableName: 'category' })
export class Category extends Model<Category, ICategoryCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  description: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    onDelete: 'Restrict',
  })
  parent_category_id: number;

  @BelongsTo(() => Category)
  category: Category

  @HasMany(() => Discount)
  discount: Discount[]
}