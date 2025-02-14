import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IAdminCreationAttr {
  name: string;
  email: string;
  login: string;
  hashed_password: string;
  image: string;
  is_creator: boolean;
}

@Table({ tableName: 'admin' })
export class Admin extends Model<Admin, IAdminCreationAttr> {
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
    type: DataType.STRING,
  })
  email: string;

  @Column({
    type: DataType.STRING(50),
    unique: true,
    allowNull: false,
  })
  login: string;

  @Column({
    type: DataType.STRING,
  })
  hashed_password: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_active: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_creator: boolean;

  @Column({
    type: DataType.STRING,
  })
  hashed_refreshtoken: string;

  @Column({
    type: DataType.STRING,
  })
  image: string;
}