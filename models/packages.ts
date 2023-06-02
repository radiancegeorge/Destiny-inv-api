import { Model, Sequelize, DataTypes } from "sequelize";

interface PackagesAttributes {
  id: string;
  name: string;
  investmentAmount: number;
  returnAfterMaturity: number;
  maturityPeriodInDays: number;
  contractIndex: number;
}

const packages = (sequelize: Sequelize, datatypes: typeof DataTypes) => {
  class packages
    extends Model<PackagesAttributes>
    implements PackagesAttributes
  {
    static associate = (models: any) => {
      packages.belongsToMany(models.users, {
        through: {
          model: models.userPackages,
          unique: false,
        },
      });
      packages.hasMany(models.coupons);
    };
    id!: string;
    name!: string;
    investmentAmount!: number;
    returnAfterMaturity!: number;
    maturityPeriodInDays!: number;
    contractIndex!: number;
  }

  packages.init(
    {
      id: {
        primaryKey: true,
        type: datatypes.UUID,
        defaultValue: datatypes.UUIDV4,
      },
      name: {
        unique: true,
        type: datatypes.STRING,
        allowNull: false,
      },
      investmentAmount: {
        type: datatypes.DECIMAL(10, 2),
        allowNull: false,
      },
      returnAfterMaturity: {
        type: datatypes.DECIMAL(10, 2),
        allowNull: false,
      },
      maturityPeriodInDays: {
        type: datatypes.INTEGER,
        allowNull: false,
        defaultValue: 14,
      },
      contractIndex: {
        type: datatypes.INTEGER,
      },
    },
    { sequelize, tableName: "packages" }
  );

  return packages;
};

module.exports = packages;
