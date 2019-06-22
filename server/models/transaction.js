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
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isIn: [
          [0, 1, 2],
        ],
      },
    },
  }, {});

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
                Transaction.update({ status: 1 }, { where: { transactionId: this.transactionId } });

                resolve({
                  amount: this.amount,
                  user: fromUser,
                  account: fromAccount,
                  message: withdraw.message,
                });
              } else {
                Transaction.update({ status: 2 }, { where: { transactionId: this.transactionId } });
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
