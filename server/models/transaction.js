module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    amount: DataTypes.BIGINT,
  }, {});

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

  Transaction.registerTransaction = params => Transaction.create(params);

  return Transaction;
};
