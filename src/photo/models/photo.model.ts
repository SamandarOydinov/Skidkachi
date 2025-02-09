import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Discount } from "../../discount/models/discount.model";

interface IPhotoCreationAttr{
    url: string;
    discount_id: number;
}

@Table({ tableName: 'photo' })
export class Photo extends Model<Photo, IPhotoCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  url: string;

  @ForeignKey(() => Discount)
  @Column({
    type: DataType.INTEGER,
  })
  discount_id: number;

  @BelongsTo(() => Discount)
  discount: Discount
}