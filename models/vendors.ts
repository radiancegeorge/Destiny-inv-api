import { Model, DataTypes, Sequelize } from "sequelize";

interface VendorProperties {
  name: string;
  phoneNumber: string;
}

const vendors = (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class vendors extends Model<VendorProperties> implements VendorProperties {
    static associate = (models: any) => {};
    name!: string;
    phoneNumber!: string;
  }

  vendors.init(
    {
      name: {
        type: dataTypes.STRING,
      },
      phoneNumber: {
        type: dataTypes.STRING,
        allowNull: false,
      },
    },
    { tableName: "vendors", sequelize }
  );

  return vendors;
};

module.exports = vendors;
