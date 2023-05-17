import { Model, Sequelize, DataTypes } from "sequelize";
import rs from "randomstring";
interface CouponsAttributes {
  id?: string;
  code: string;
  packageId?: string;
  isRedeemed: boolean;
}

const coupons = (sequelize: Sequelize, datatypes: typeof DataTypes) => {
  class coupons extends Model<CouponsAttributes> implements CouponsAttributes {
    static associate = (model: any) => {
      coupons.belongsTo(model.packages, { foreignKey: { allowNull: false } });
    };
    code!: string;
    isRedeemed!: boolean;
  }

  coupons.init(
    {
      code: {
        allowNull: false,
        type: datatypes.STRING,
        unique: "code",
      },
      isRedeemed: {
        type: datatypes.BOOLEAN,
        defaultValue: false,
      },
    },
    { sequelize, tableName: "coupons" }
  );

  coupons.beforeValidate("generate code", (coupons) => {
    coupons.code = rs.generate(16);
  });
  return coupons;
};

module.exports = coupons;
