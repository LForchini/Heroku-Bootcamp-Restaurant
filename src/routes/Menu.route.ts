import express, { Request, Response } from "express";
import Menu from "../models/Menu.model";
import { check, validationResult } from "express-validator";
import MenuItem from "../models/MenuItem.model";
import Restaurant from "../models/Restaurant.model";

interface MenuObj {
  title: string;
  items: MenuItemObj[];
  restaurantId: number;
}
interface MenuItemObj {
  name: string;
  price: number;
  menuId: number;
}



const router = express.Router({mergeParams: true});

router.get("/", async (req: Request, res: Response) => {
  const options = {}
  const menus = await Menu.findAll({where: options});
  
  res.send(menus);
});

router.get("/:id", async (req: Request, res: Response) => {
  const options = {id: req.params.id};
  const menu = await Menu.findOne({ include: [MenuItem], where: options });
  if (menu) {
    res.send(menu);
  } else {
    res.sendStatus(404);
  }
});

router.post(
  "/",
  [
    check("title").not().isEmpty().trim().escape(),
    check("title").isLength({ min: 1, max: 50 }),
    check("restaurantId").notEmpty(),
    check("restaurantId").isNumeric(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const raw_menu: MenuObj = req.body;

    const menu = new Menu({
      title: raw_menu.title,
      restaurantId: raw_menu.restaurantId,
    });
    await menu.save();
    res.send(menu);
  }
);

router.delete("/:id", async (req: Request, res: Response) => {
  const options = {id: req.params.id};
  const menu = await Menu.findOne({ include: [MenuItem], where: options });
  if (menu) {
    await menu.destroy();
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

router.put(
  "/:id",
  [check("title").isLength({ min: 1, max: 50 })],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const raw_menu: MenuObj = req.body;
    const options = {id: req.params.id};
    const menu = await Menu.findOne({ include: [MenuItem], where: options });
    if (menu) {
      menu.title = raw_menu.title;
      await menu.save();
      res.send(menu);
    } else {
      res.sendStatus(404);
    }
  }
);

export = router;
