import {
  Table,
  Column,
  Model,
  HasMany,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";
import Menu from "./Menu.model";

@Table
export default class Restaurant extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.TEXT)
  name!: string;

  @Column(DataType.TEXT)
  image!: string;

  @HasMany(() => Menu)
  menus!: Menu[];
}
