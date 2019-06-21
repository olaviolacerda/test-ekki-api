/* eslint-disable func-names */
const SequelizeTokenify = require('sequelize-tokenify');

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    amount: DataTypes.DECIMAL(20, 2),
    transactionId: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Pendente',
      validate: {
        isIn: [
          [
            'Pendente',
            'Cancelada',
            'Realizada',
          ],
        ],
      },
    },
  }, {

  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, {
      foreignKey: 'fromUserId',
      as: 'fromUser',
      onDelete: 'CASCADE',
    });

    Transaction.belongsTo(models.User, {
      foreignKey: 'toUserId',
      as: 'toUser',
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
      this.getFromUser().then((fromUser) => {
        this.getToUser().then((toUser) => {
          fromUser.getAccount().then((fromAccount) => {
            toUser.getAccount().then((toAccount) => {
              const withdraw = fromAccount.withdraw(Number(this.amount));

              if (withdraw.status) {
                toAccount.deposit(Number(this.amount));
                this.update({ status: 'Realizada' });
                resolve({
                  account: fromAccount,
                  message: withdraw.message,
                });
              } else {
                this.update({ status: 'Realizada' });
                reject(new Error('Transferência não realizada.'));
              }
            });
          });
        });
      });
    });
  };

  return Transaction;
};
