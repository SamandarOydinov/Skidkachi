import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Category } from '../../category/models/category.model';
import { DiscountType } from '../../discount_type/models/discount_type.model';
import { Store } from '../../store/models/store.model';
import { Photo } from '../../photo/models/photo.model';
import { Favourites } from '../../favourites/models/favourite.model';
import { Review } from '../../reviews/models/review.model';

interface IDiscountCreationAttr {
  store_id: number;
  title: string;
  description: string;
  discount_percent: number;
  start_date: Date;
  end_date: Date;
  category_id: number;
  discount_value: string;
  special_link: string;
  discount_type_id: number;
}

@Table({ tableName: 'discount' })
export class Discount extends Model<Discount, IDiscountCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  title: string;

  @Column({
    type: DataType.STRING,
  })
  description: string;

  @Column({
    type: DataType.INTEGER,
  })
  discount_percent: number;

  @Column({
    type: DataType.DATE,
  })
  start_date: Date;

  @Column({
    type: DataType.DATE,
  })
  end_date: Date;

  @Column({
    type: DataType.STRING,
  })
  discount_value: string;

  @Column({
    type: DataType.STRING,
  })
  special_link: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    onDelete: 'Restrict',
  })
  category_id: number;

  @BelongsTo(() => Category)
  category: Category;

  @ForeignKey(() => DiscountType)
  @Column({
    type: DataType.INTEGER,
    onDelete: 'Restrict',
  })
  discount_type_id: number;

  @BelongsTo(() => DiscountType)
  discount_type: DiscountType;

  @ForeignKey(() => Store)
  @Column({
    type: DataType.INTEGER,
    onDelete: 'Restrict',
  })
  store_id: number;

  @BelongsTo(() => Store)
  store: Store;

  @HasMany(() => Photo)
  photo: Photo[];

  @HasMany(() => Favourites)
  favourites: Favourites[];

  @HasMany(() => Review)
  review: Review[];
}
