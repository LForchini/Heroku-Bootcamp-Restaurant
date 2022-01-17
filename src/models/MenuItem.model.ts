import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import Menu from "./Menu.model";

@Table
export default class MenuItem extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Menu)
  @Column(DataType.INTEGER)
  menuId!: number;

  @BelongsTo(() => Menu, { onDelete: "CASCADE" })
  menu!: Menu;

  @Column(DataType.TEXT)
  name!: string;

  @Column(DataType.INTEGER)
  price!: number;
}
