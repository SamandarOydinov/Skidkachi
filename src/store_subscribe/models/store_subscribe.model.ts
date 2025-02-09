import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { Store } from '../../store/models/store.model';

interface IStoreSubscribe {
  created_at: Date;
  user_id: number;
  store_id: number;
}

@Table({ tableName: 'store_subscribe' })
export class StoreSubscribe extends Model<StoreSubscribe, IStoreSubscribe> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  user_id: number;

  @ForeignKey(() => Store)
  @Column({
    type: DataType.INTEGER,
  })
  store_id: number;
}
