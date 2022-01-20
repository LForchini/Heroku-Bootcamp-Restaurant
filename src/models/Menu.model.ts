import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  HasMany,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import Restaurant from "./Restaurant.model";
import MenuItem from "./MenuItem.model";

@Table
export default class Menu extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Restaurant)
  @Column(DataType.INTEGER)
  restaurantId!: number;

  @BelongsTo(() => Restaurant, { onDelete: "CASCADE" })
  restaurant!: Restaurant;

  @Column(DataType.TEXT)
  title!: string;

  @Column(DataType.INTEGER)
  positionId!: number;

  @HasMany(() => MenuItem)
  items!: MenuItem[];
}
