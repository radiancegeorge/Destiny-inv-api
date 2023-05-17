"use strict";
import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.ts")[env];

interface Attributes {
  [key: string]: string;
}

export interface M extends ModelStatic<Model<Attributes>> {
  associate: Function;
}

export interface Models {
  [key: string]: M;
}

export const models: Models = {};

interface DB {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}
let sequelize: any;
const db: DB = {
  sequelize,
  Sequelize,
};

if (config.use_env_variable) {
  sequelize = new Sequelize(
    process.env[config.use_env_variable] as string,
    config
  );
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}
fs.readdirSync(__dirname)
  .filter((file: any) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".ts"
    );
  })
  .forEach((file: any) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    models[model.name] = model;
  });

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default { ...db, models };
