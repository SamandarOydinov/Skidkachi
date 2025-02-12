import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface ICarsCreationAttr {
  user_id: number | undefined;
  last_state: string | undefined;
}

@Table({ tableName: 'cars' })
export class Cars extends Model<Cars, ICarsCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.BIGINT,
  })
  user_id: number | undefined;

  @Column({
    type: DataType.STRING,
  })
  name: string | undefined;

  @Column({
    type: DataType.STRING,
  })
  brand: string | undefined;

  @Column({
    type: DataType.STRING,
  })
  image: string | undefined;

  @Column({
    type: DataType.STRING,
  })
  number: string | undefined;

  @Column({
    type: DataType.STRING,
  })
  last_state: string;
}
