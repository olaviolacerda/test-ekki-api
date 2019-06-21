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

  Transaction.prototype.transfer = async function () {
    return new Promise((resolve, reject) => {
      this.getSourceAccount()
        .then(sourceAccount => this.getTargetAccount()
          .then((targetAccount) => {
            const withdraw = sourceAccount.withdraw(Number(this.amount));

            if (withdraw.status) targetAccount.deposit(Number(this.amount));

            resolve({
              account: sourceAccount,
              message: withdraw.message,
            });
          }).catch(error => reject(error)))
        .catch(error => reject(error));
    });
  };

  return Transaction;
};
