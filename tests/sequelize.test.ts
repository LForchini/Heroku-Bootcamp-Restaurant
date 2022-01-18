import Menu from "../src/models/Menu.model";
import MenuItem from "../src/models/MenuItem.model";
import Restaurant from "../src/models/Restaurant.model";
import { sequelize, loadSeed } from "../src/sequelize";

describe("Database", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  it("loads json correctly", async () => {
    await loadSeed();
    expect((await Restaurant.findAll()).length).toBeGreaterThan(0);
    expect((await Menu.findAll()).length).toBeGreaterThan(0);
    expect((await MenuItem.findAll()).length).toBeGreaterThan(0);
  });
});
