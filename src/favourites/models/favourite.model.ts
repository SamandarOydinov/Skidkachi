import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Discount } from "../../discount/models/discount.model";
import { User } from "../../users/models/user.model";

interface IFavouritesCreationAttr {
  user_id: number;
  discount_id: number;
}

@Table({ tableName: 'favourites' })
export class Favourites extends Model<Favourites, IFavouritesCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Discount)
  @Column({
    type: DataType.INTEGER,
    onDelete: 'Restrict',
  })
  discount_id: number;

  @BelongsTo(() => Discount)
  discount: Discount;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  user_id: number;

  @BelongsTo(() => User)
  user: User;
}