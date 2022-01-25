import { loadSeed } from "./src/sequelize";
import express from "express";

import RestaurantRoute from "./src/routes/Restuaurant.route";
import MenuRoute from "./src/routes/Menu.route";
import MenuItemRoute from "./src/routes/MenuItem.route";

const app = express();
const PORT: string | number = process.env.PORT || 3000;

app.use("/", express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use((req: Request, res: Response, next: NextFunction) => {
//   console.log(`Recieved ${req.method} request for ${req.path} with body `, req.body);
//   next();
// })

app.use("/restaurants", RestaurantRoute);
app.use("/menus", MenuRoute);
app.use("/items", MenuItemRoute);

app.listen(PORT, async () => {
  console.log(`Started listening on port ${PORT}`);
  await loadSeed();
  console.log(`Loaded seed database values`);
});
