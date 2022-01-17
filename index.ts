import Menu from "./src/models/Menu.model";
import MenuItem from "./src/models/MenuItem.model";
import Restaurant from "./src/models/Restaurant.model";
import { sequelize } from "./src/sequelize";
import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";

const app = express();
const PORT: string | number = process.env.PORT || 3000;

// app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
  console.log(
    `Server started listening at http://restaurants-express.herokuapp.com:${PORT}`
  );
  loadSeed().then(() => {
    console.log(`Server loaded seed database values`);
  });
});

app.get("/restaurants", async (req: Request, res: Response) => {
  const restaurants: Restaurant[] = await Restaurant.findAll();
  res.send(restaurants);
});

app.get("/restaurants/:id", async (req: Request, res: Response) => {
  const restaurant: Restaurant | null = await Restaurant.findByPk(
    req.params.id,
    { include: [Menu] }
  );
  if (restaurant) {
    res.send(restaurant);
  } else {
    res.sendStatus(404);
  }
});

app.post(
  "/restaurants",
  [
    check("name").not().isEmpty().trim().escape(),
    check("name").isAlpha("en-GB").isLength({ min: 1, max: 50 }),
    check("image").isURL().trim(),
  ],
  async (req: Request, res: Response) => {
    const raw_restaurant: RestaurantObj = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const restaurant: Restaurant = new Restaurant({
      name: raw_restaurant.name,
      image: raw_restaurant.image,
    });
    await restaurant.save();
    res.send(restaurant);
  }
);

app.delete("/restaurants/:id", async (req: Request, res: Response) => {
  const restaurant: Restaurant | null = await Restaurant.findByPk(
    req.params.id
  );
  if (restaurant) {
    await restaurant.destroy();
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

app.put(
  "/restaurants/:id",
  [
    check("name").isAlpha("en-GB").isLength({ min: 1, max: 50 }),
    check("image").isURL().trim(),
  ],
  async (req: Request, res: Response) => {
    const restaurant: Restaurant | null = await Restaurant.findByPk(
      req.params.id
    );
    if (restaurant) {
      if (req.body.name) {
        restaurant.name = req.body.name;
      }
      if (req.body.image) {
        restaurant.image = req.body.image;
      }
      await restaurant.save();
      await restaurant.reload();
      res.send(restaurant);
    } else {
      res.sendStatus(404);
    }
  }
);
