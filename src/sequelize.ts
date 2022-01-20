import { Sequelize } from "sequelize-typescript";
import Restaurant from "./models/Restaurant.model";
import Menu from "./models/Menu.model";
import MenuItem from "./models/MenuItem.model";

const location =
  process.env.NODE_ENV === "test" ? ":memory:" : "./restaurants.sqlite";

const sequelize = new Sequelize("database", "username", "password", {
  dialect: "sqlite",
  storage: location,
  logging: false,
  models: [__dirname + "/models/**/*.model.ts"],
  modelMatch: (filename, member) => {
    return (
      filename.substring(0, filename.indexOf(".model")) === member.toLowerCase()
    );
  },
});

interface RestaurantObj {
  name: string;
  image: string;
  menus: MenuObj[];
}
interface MenuObj {
  title: string;
  items: MenuItemObj[];
}
interface MenuItemObj {
  name: string;
  price: number;
}

async function loadSeed() {
  await sequelize.sync({ force: true });
  const restaurants: RestaurantObj[] = require("./seed.json");

  restaurants.forEach(async (restaurant_obj: RestaurantObj) => {
    const restaurant = new Restaurant({
      name: restaurant_obj.name,
      image: restaurant_obj.image,
    });
    await restaurant.save();

    restaurant_obj.menus.forEach(async (menu_obj: MenuObj, menu_index: number) => {
      const menu = new Menu({
        title: menu_obj.title,
        restaurantId: restaurant.id,
        positionId: menu_index + 1
      });
      await menu.save();

      menu_obj.items.forEach(async (menuItem_obj: MenuItemObj, item_index: number) => {
        const menuItem = new MenuItem({
          name: menuItem_obj.name,
          price: menuItem_obj.price,
          menuId: menu.id,
          positionId: item_index + 1
        });
        await menuItem.save();
      });
    });
  });
}

export { sequelize, loadSeed };
