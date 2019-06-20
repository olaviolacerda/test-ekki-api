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

  Transaction.prototype.transfer = function () {
    return new Promise((resolve, reject) => {
      this.getSourceAccount().then((sourceAccount) => {
        this.getTargetAccount().then((targetAccount) => {
          resolve();
        });
      });
    });
  };

  return Transaction;
};
