import Menu from "./src/models/Menu.model";
import MenuItem from "./src/models/MenuItem.model";
import Restaurant from "./src/models/Restaurant.model";
import { sequelize } from "./src/sequelize";
import express from "express";

import RestaurantRoute from "./src/routes/Restuaurant.route";
import MenuRoute from "./src/routes/Menu.route";
import MenuItemRoute from "./src/routes/MenuItem.route";

const app = express();
const PORT: string | number = process.env.PORT || 3000;

// app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/restaurants", RestaurantRoute);
app.use("/menus", MenuRoute);
app.use("/items", MenuItemRoute);

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

    restaurant_obj.menus.forEach(async (menu_obj: MenuObj) => {
      const menu = new Menu({
        title: menu_obj.title,
        restaurantId: restaurant.id,
        restaurant: restaurant,
      });
      await menu.save();

      menu_obj.items.forEach(async (menuItem_obj: MenuItemObj) => {
        const menuItem = new MenuItem({
          name: menuItem_obj.name,
          price: menuItem_obj.price,
          menuId: menu.id,
          menu: menu,
        });
        await menuItem.save();
      });
    });
  });
}

app.listen(PORT, () => {
  console.log(`Server started listening on port ${PORT}`);
  loadSeed().then(() => {
    console.log(`Server loaded seed database values`);
  });
});
