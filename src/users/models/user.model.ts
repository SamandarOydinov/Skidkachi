import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { StoreSubscribe } from '../../store_subscribe/models/store_subscribe.model';
import { Store } from '../../store/models/store.model';
import { Favourites } from '../../favourites/models/favourite.model';
import { Review } from '../../reviews/models/review.model';
import { Region } from '../../region/models/region.model';

interface IUserInresfaceCreationAttr {
  name: string;
  phone: string;
  email: string;
  hashedPassword: string;
  activation_link: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, IUserInresfaceCreationAttr> {
  @ApiProperty({
    example: 1,
    description: 'Foydalanuvchi ID raqami',
  })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(20),
    unique: true,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
  })
  hashedPassword: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_active: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_owner: boolean;

  @Column({
    type: DataType.STRING,
  })
  hashedRefreshToken: string | null;

  @Column({
    type: DataType.STRING,
  })
  activation_link: string;

  @ForeignKey(() => Region)
  @Column({
    type: DataType.INTEGER,
  })
  region_id: number;

  @BelongsTo(() => Region)
  region: Region;

  @HasMany(() => StoreSubscribe)
  storeSubscribe: StoreSubscribe[];

  @HasMany(() => Store)
  store: Store[];

  @HasMany(() => Favourites)
  favourites: Favourites[];

  @HasMany(() => Review)
  review: Review[];

}
