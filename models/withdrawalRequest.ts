import { Model, Sequelize, DataTypes } from "sequelize";

interface WithdrawalAttributes {
  id?: string;
  userId?: string;
  userPackageId?: string;
  amount: number;
  paymentMethod: string;
  status: string;
}

const withdrawals = (sequelize: Sequelize, datatypes: typeof DataTypes) => {
  class withdrawalRequests
    extends Model<WithdrawalAttributes>
    implements WithdrawalAttributes
  {
    static associate = (model: any) => {
      withdrawalRequests.belongsTo(model.users);
      withdrawalRequests.belongsTo(model.userPackages);
      withdrawalRequests.belongsTo(model.transactions);
    };

    id!: string;
    userId!: string;
    userPackageId!: string;
    amount!: number;
    paymentMethod!: string; // 'Bank Transfer' or 'USDT'
    status!: string; // 'Pending', 'Approved', 'Rejected', 'Processed'
  }

  withdrawalRequests.init(
    {
      id: {
        primaryKey: true,
        type: datatypes.UUID,
        defaultValue: datatypes.UUIDV4,
      },
      amount: {
        type: datatypes.DECIMAL(10, 2),
        allowNull: false,
      },
      paymentMethod: {
        type: datatypes.ENUM("Bank Transfer", "USDT"),
        allowNull: false,
      },
      status: {
        type: datatypes.ENUM("Pending", "Approved", "Rejected", "Processed"),
        allowNull: false,
        defaultValue: "Pending",
      },
    },
    { sequelize, tableName: "withdrawalRequests" }
  );

  return withdrawalRequests;
};

module.exports = withdrawals;
