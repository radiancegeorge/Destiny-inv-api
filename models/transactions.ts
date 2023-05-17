import { Model, Sequelize, DataTypes } from "sequelize";

interface TransactionsAttributes {
  id?: string;
  transactionType: "investment" | "withdrawal";
  amount: number;
}

const transactions = (sequelize: Sequelize, datatypes: typeof DataTypes) => {
  class transactions
    extends Model<TransactionsAttributes>
    implements TransactionsAttributes
  {
    static associate = (model: any) => {
      transactions.belongsTo(model.users);
      transactions.belongsTo(model.userPackages);
    };
    transactionType!: "investment" | "withdrawal";
    amount!: number;
    transactionDate!: Date;
  }

  transactions.init(
    {
      transactionType: {
        allowNull: false,
        type: datatypes.ENUM("investment", "withdrawal"),
        defaultValue: "investment",
      },
      amount: {
        allowNull: false,
        type: datatypes.DECIMAL(10, 2),
      },
    },
    { sequelize, tableName: "transactions" }
  );
  return transactions;
};

module.exports = transactions;
