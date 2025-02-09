import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { District } from '../../district/models/district.model';
import { User } from '../../users/models/user.model';

interface IRegion {
  name: string;
  image: string;
}

@Table({ tableName: 'region' })
export class Region extends Model<Region, IRegion> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: Number;

  @Column({
    type: DataType.STRING(50),
  })
  name: String;

  @Column({
    type: DataType.STRING,
  })
  image: string;

  @HasMany(() => District)
  district: District[];

  @HasMany(() => User)
  users: User[];
}
