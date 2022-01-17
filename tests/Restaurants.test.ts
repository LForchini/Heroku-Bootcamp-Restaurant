import Restaurant from "../src/models/Restaurant.model";
import { sequelize } from "../src/sequelize";

describe("Restaurant", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  it("can be created", async () => {
    const restaurant: Restaurant = new Restaurant({
      name: "Name",
      image: "Image",
    });
    await restaurant.save();

    expect(restaurant.name).toBe("Name");
    expect(restaurant.image).toBe("Image");
    expect(restaurant.id).not.toBe(null);
  });

  it("can have multiple instances", async () => {
    const restaurant1: Restaurant = new Restaurant({
      name: "Name 1",
      image: "Image 1",
    });
    await restaurant1.save();
    const restaurant2: Restaurant = new Restaurant({
      name: "Name 2",
      image: "Image 2",
    });
    await restaurant2.save();

    expect(restaurant1.name).toBe("Name 1");
    expect(restaurant1.image).toBe("Image 1");
    expect(restaurant1.id).not.toBe(null);

    expect(restaurant2.name).toBe("Name 2");
    expect(restaurant2.image).toBe("Image 2");
    expect(restaurant2.id).not.toBe(restaurant1.id);
  });
});
