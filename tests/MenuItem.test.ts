import Menu from "../src/models/Menu.model";
import MenuItem from "../src/models/MenuItem.model";
import { sequelize } from "../src/sequelize";

describe("MenuItem", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  it("can be created", async () => {
    const item: MenuItem = new MenuItem({
      name: "Name",
      price: 20,
    });
    await item.save();

    expect(item.name).toBe("Name");
    expect(item.price).toBe(20);
    expect(item.id).not.toBe(null);
  });

  it("can be associated with a Menu", async () => {
    const menu: Menu = new Menu({ title: "Title" });
    await menu.save();

    const item: MenuItem = new MenuItem({
      name: "Name",
      price: 20,
      menuId: menu.id,
    });
    await item.save();

    await menu.reload({ include: [MenuItem] });
    await item.reload({ include: [Menu] });

    expect(item.menuId).toBe(menu.id);
    expect(item.menu.equals(menu)).toBeTruthy();
    expect(menu.items.length).toBe(1);
    expect(menu.items[0].equals(item)).toBeTruthy();
  });

  it("can have multiple instances", async () => {
    const item1: MenuItem = new MenuItem({
      name: "Name",
      price: 20,
    });
    await item1.save();
    const item2: MenuItem = new MenuItem({
      name: "Name",
      price: 20,
    });
    await item2.save();

    expect(item1.name).toBe("Name");
    expect(item1.price).toBe(20);
    expect(item1.id).not.toBe(null);

    expect(item2.name).toBe("Name");
    expect(item2.price).toBe(20);
    expect(item2.id).not.toBe(item1.id);
  });
});
