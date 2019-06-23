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

  Transaction.duplicatedTransaction = async function (req, res, pastTransaction) {
    await Transaction.update({ status: 2 },
      { where: { transactionId: pastTransaction.transactionId } })
      .then(() => {
        Transaction.registerTransaction(req.body).then((transaction) => {
          Transaction.update({ status: 1 },
            { where: { transactionId: transaction.transactionId } });
          res.status(200).json({ transaction, message: 'Transferência duplicada, iremos manter somente a última.' });
        });
      });
  };

  Transaction.transfer = async function ({ body, io }, userModel) {
    return new Promise(async (resolve, reject) => {
      await userModel.findOne({
        where: { id: body.fromUserId }, include: ['account'],
      }).then((fromUser) => {
        userModel.findOne({
          where: { id: body.toUserId }, include: ['account'],
        }).then(async (toUser) => {
          if (!toUser) {
            reject({ message: 'Usuário destino não encontrado.' });
          } else {
            await fromUser.account.withdraw(Number(body.amount))
              .then((withdraw) => {
                io.emit(`account-${fromUser.cpf}`, fromUser.account);
                toUser.account.deposit(Number(body.amount));
                io.emit(`account-${toUser.cpf}`, toUser.account);
                Transaction.registerTransaction({ ...body, status: 1 })
                  .then((response) => {
                    io.emit(`transaction-${toUser.cpf}`, response);
                    io.emit(`transaction-${fromUser.cpf}`, response);
                    resolve({
                      amount: response.amount,
                      user: fromUser,
                      message: withdraw.message,
                    });
                  }).catch(error => reject(error));
              }).catch((error) => {
                reject(error);
              });
          }
        });
      });
    });
  };

  return Transaction;
};
