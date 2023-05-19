import { Model, Sequelize, DataTypes } from "sequelize";

interface UserPackagesAttributes {
  id?: string;
  maturityDate: Date;
  status: "renewed" | "withdrawn";
  userId?: string;
}

const userPackages = (sequelize: Sequelize, datatypes: typeof DataTypes) => {
  class userPackages
    extends Model<UserPackagesAttributes>
    implements UserPackagesAttributes
  {
    static associate = (model: any) => {
      userPackages.belongsTo(model.coupons);
      userPackages.belongsTo(model.packages);
    };
    id?: string;
    maturityDate!: Date;
    status!: "renewed" | "withdrawn";
    userId?: string;
  }

  userPackages.init(
    {
      id: {
        type: datatypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      maturityDate: {
        allowNull: false,
        type: datatypes.DATE,
      },

      status: {
        type: datatypes.ENUM("withdrawn", "renewed"),
        defaultValue: "withdrawn",
      },
    },
    {
      sequelize,
      tableName: "userPackages",
    }
  );
  userPackages.beforeCreate("Limit Validation", async (instance) => {
    const max = Number(process.env.MAX_USER_PACKAGE);
    const { userId } = instance.dataValues as any;
    const count = await userPackages.count({
      where: {
        userId,
      },
    });
    if (count >= max) throw { message: "minimum package at once reached" };
  });
  return userPackages;
};

module.exports = userPackages;
