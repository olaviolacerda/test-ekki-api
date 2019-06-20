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
      as: 'source',
      onDelete: 'CASCADE',
    });

    Transaction.belongsTo(models.Account, {
      foreignKey: 'targetAccountId',
      as: 'target',
      onDelete: 'CASCADE',
    });
  };

  SequelizeTokenify.tokenify(Transaction, {
    field: 'transactionId',
    charset: 'numeric',
  });

  Transaction.registerTransaction = params => Transaction.create(params);

  return Transaction;
};
