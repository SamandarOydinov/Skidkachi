import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Discount } from "../../discount/models/discount.model";
import { StoreSubscribe } from "../../store_subscribe/models/store_subscribe.model";
import { StoreSocialLink } from "../../store_social_link/models/store_social_link.model";
import { User } from "../../users/models/user.model";
import { District } from "../../district/models/district.model";

interface IStoreCreationAttr {
  name: string;
  location: string;
  phone: string;
  created_at: Date;
  owner_id: number;
  store_social_link_id: number;
  since: string;
  district_id: number;
}

@Table({ tableName: 'store' })
export class Store extends Model<Store, IStoreCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(50),
  })
  name: string;

  @Column({
    type: DataType.STRING(50),
  })
  location: string;

  @Column({
    type: DataType.STRING,
  })
  phone: string;

  @Column({
    type: DataType.DATE,
  })
  created_at: Date;

  @Column({
    type: DataType.STRING,
  })
  since: string;

  @HasMany(() => Discount)
  discount: Discount;

  @HasMany(() => StoreSubscribe)
  storeSubscribe: StoreSubscribe;

  @ForeignKey(() => StoreSocialLink)
  @Column({
    type: DataType.INTEGER,
  })
  store_social_link_id: number;

  @BelongsTo(() => StoreSocialLink)
  storeSocialLink: StoreSocialLink;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  owner_id: number;

  @BelongsTo(() => User)
  Owner: User;

  @ForeignKey(() => District)
  @Column({
    type: DataType.INTEGER,
  })
  district_id: number;

  @BelongsTo(() => District)
  district: District;
}