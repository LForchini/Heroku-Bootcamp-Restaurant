import { Sequelize } from "sequelize-typescript";

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

export { sequelize };
