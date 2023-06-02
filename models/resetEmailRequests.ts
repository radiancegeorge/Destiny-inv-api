import { DataTypes, Sequelize, Model } from "sequelize";

interface ResetPasswordProperties {
  code: string;
  id: string;
}

const requestResetPassword = (
  sequelize: Sequelize,
  datatypes: typeof DataTypes
) => {
  class requestResetPassword
    extends Model<ResetPasswordProperties>
    implements ResetPasswordProperties
  {
    static associate = (models: any) => {
      requestResetPassword.belongsTo(models.users, {
        foreignKey: {
          allowNull: false,
        },
      });
    };
    id!: string;
    code!: string;
  }

  requestResetPassword.init(
    {
      id: {
        primaryKey: true,
        type: datatypes.UUID,
        defaultValue: datatypes.UUIDV4,
      },
      code: {
        type: datatypes.UUID,
        defaultValue: datatypes.UUIDV4,
      },
    },
    {
      sequelize,
      tableName: "requestResetPassword",
    }
  );
  return requestResetPassword;
};

module.exports = requestResetPassword;
