import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Store } from "../../store/models/store.model";
import { SocialLink } from "../../social_link/models/social_link.model";

interface IStoreSocialLinkCreationAttr {
  url: string;
  description: string;
  social_link_id: number;
}

@Table({ tableName: 'store_social_link' })
export class StoreSocialLink extends Model<
  StoreSocialLink,
  IStoreSocialLinkCreationAttr
> {
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

  @Column({
    type: DataType.STRING,
  })
  description: string;

  @HasMany(() => Store)
  store: Store[];

  @ForeignKey(() => SocialLink)
  @Column({
    type: DataType.INTEGER,
  })
  social_link_id: number;

  @BelongsTo(() => SocialLink)
  socialLink: SocialLink;
}