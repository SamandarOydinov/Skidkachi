import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Discount } from '../../discount/models/discount.model';
import { User } from '../../users/models/user.model';

interface IReviewsCreationAttr {
  discount_id: number;
  user_id: number;
  text: string;
  raiting: number;
  photo: string;
}

@Table({ tableName: 'reviews' })
export class Review extends Model<Review, IReviewsCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  text: string;

  @Column({
    type: DataType.INTEGER,
  })
  raiting: number;

  @Column({
    type: DataType.STRING,
  })
  photo: string;

  @ForeignKey(() => Discount)
  @Column({
    type: DataType.INTEGER,
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
