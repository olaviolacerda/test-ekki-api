/* eslint-disable func-names */
const SequelizeTokenify = require('sequelize-tokenify');

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    amount: DataTypes.BIGINT,
    transactionId: {
      type: DataTypes.INTEGER,
      unique: true,
    },
  }, {

  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Account, {
      foreignKey: 'sourceAccountId',
      as: 'sourceAccount',
      onDelete: 'CASCADE',
    });

    Transaction.belongsTo(models.Account, {
      foreignKey: 'targetAccountId',
      as: 'targetAccount',
      onDelete: 'CASCADE',
    });
  };

  SequelizeTokenify.tokenify(Transaction, {
    field: 'transactionId',
    charset: 'numeric',
  });

  Transaction.registerTransaction = params => Transaction.create(params);

  Transaction.transfer = async (amount, accounts) => new Promise((resolve, reject) => {
    const [sourceAccount, targetAccount] = accounts;


    const withdraw = sourceAccount.withdraw(Number(amount));

    if (withdraw.status) {
      Transaction.registerTransaction(amount, sourceAccount.id, targetAccount.id);
      targetAccount.deposit(Number(amount));

      resolve({
        account: sourceAccount,
        message: withdraw.message,
      });
    } else {
      reject(new Error('Transferência não realizada.'));
    }
  });

  return Transaction;
};
