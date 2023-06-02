import { Sequelize, DataTypes, Model } from "sequelize";

interface UsersAttributes {
  id: string;
  username: string;
  email: string;
  password: string;
  walletAddress: string;
  phoneNumber: string;
  bankAccountNumber: string;
  bankName: string;
  fullName: string;
}

const users = (sequelize: Sequelize, datatypes: typeof DataTypes) => {
  class users extends Model<UsersAttributes> implements UsersAttributes {
    static associate = (models: any) => {
      users.belongsToMany(models.packages, {
        through: { model: models.userPackages, unique: false },
      });
      users.hasOne(models.requestResetPassword);
    };
    id!: string;
    username!: string;
    email!: string;
    password!: string;
    walletAddress!: string;
    bankAccountNumber!: string;
    phoneNumber!: string;
    bankName!: string;
    fullName!: string;
  }

  users.init(
    {
      id: {
        primaryKey: true,
        type: datatypes.UUID,
        defaultValue: datatypes.UUIDV4,
      },
      username: {
        type: datatypes.STRING,
        allowNull: false,
        unique: "username",
      },
      email: {
        type: datatypes.STRING,
        allowNull: false,
        unique: "email",
      },
      password: {
        type: datatypes.STRING,
        allowNull: false,
      },
      walletAddress: {
        type: datatypes.STRING,
        allowNull: true,
        unique: "walletAddress",
      },
      phoneNumber: {
        type: datatypes.STRING,
      },
      bankAccountNumber: {
        type: datatypes.STRING,
      },
      fullName: {
        type: datatypes.STRING,
      },
      bankName: {
        type: datatypes.STRING,
      },
    },
    {
      sequelize,
      paranoid: true,
      tableName: "users",
    }
  );
  return users;
};

module.exports = users;
