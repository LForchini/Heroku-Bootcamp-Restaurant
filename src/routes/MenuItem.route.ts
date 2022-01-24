import express, { Request, Response } from "express";
import MenuItem from "../models/MenuItem.model";
import { check, validationResult } from "express-validator";
import Menu from "../models/Menu.model";

interface MenuItemObj {
  name: string;
  price: number;
  menuId: number;
}

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const items: MenuItem[] = await MenuItem.findAll();
  res.send(items);
});

router.get("/:id", async (req: Request, res: Response) => {
  const item = await MenuItem.findByPk(req.params.id);
  if (item) {
    res.send(item);
  } else {
    res.sendStatus(404);
  }
});

router.post(
  "/",
  [
    check("name").not().isEmpty().trim().escape(),
    check("name").isLength({ min: 1, max: 50 }),
    check("price").not().isEmpty(),
    check("price").isNumeric(),
    check("menuId").notEmpty(),
    check("menuId").isNumeric(),
  ],
  async (req: Request, res: Response) => {
    const raw_item: MenuItemObj = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const item = new MenuItem({
      name: raw_item.name,
      price: raw_item.price,
      menuId: raw_item.menuId,
    });
    await item.save();
    res.send(item);
  }
);

router.delete("/:id", async (req: Request, res: Response) => {
  const item = await MenuItem.findByPk(req.params.id);
  if (item) {
    await item.destroy();
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

router.put(
  "/:id",
  [
    check("name").isAlpha("en-GB").isLength({ min: 1, max: 50 }),
    check("price").isNumeric(),
  ],
  async (req: Request, res: Response) => {
    const item = await MenuItem.findByPk(req.params.id);
    if (item) {
      if (req.body.name) {
        item.name = req.body.name;
      }
      if (req.body.price) {
        item.price = req.body.price;
      }
      await item.save();
      res.send(item);
    } else {
      res.sendStatus(404);
    }
  }
);

export = router;
