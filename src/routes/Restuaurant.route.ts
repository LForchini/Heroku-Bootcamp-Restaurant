import express, { Request, Response } from "express";
import Restaurant from "../models/Restaurant.model";
import Menu from "../models/Menu.model";
import { check, validationResult } from "express-validator";

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

const router = express.Router({mergeParams: true});

router.get("/", async (req: Request, res: Response) => {
  const restaurants: Restaurant[] = await Restaurant.findAll({include: [Menu]});
  res.send(restaurants);
});

router.get("/:id", async (req: Request, res: Response) => {
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

router.post(
  "/",
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

router.delete("/:id", async (req: Request, res: Response) => {
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

router.put(
  "/:id",
  [
    check("name").isAlpha("en-GB").isLength({ min: 1, max: 50 }),
    check("image").isURL(),
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
      res.send(restaurant);
    } else {
      res.sendStatus(404);
    }
  }
);

router.get(":restaurantId/menus");
router.get(":restaurantId/menus/:menuId");
router.get(":restaurantId/menus/:menuId/items");
router.get(":restaurantId/menus/:menuId/items/:itemId");
router.get(":restaurantId/items");
router.get(":restaurantId/items/:itemId");

export = router;
