const { Op } = require('sequelize');
const { Transaction } = require('../models');

async function transfer(req, res) {
  const pastTransaction = await Transaction.findOne({ where: req.body, limit: 1, order: [['createdAt', 'DESC']] });

  if (pastTransaction) {
    const pastTransactionDate = pastTransaction.createdAt.getTime();
    const actualTime = new Date().getTime();

    if (actualTime - pastTransactionDate < 120000) {
      await Transaction.update({ status: 2 },
        { where: { transactionId: pastTransaction.transactionId } })
        .then(() => {
          Transaction.registerTransaction(req.body).then((transaction) => {
            Transaction.update({ status: 1 },
              { where: { transactionId: transaction.transactionId } });
            res.status(200).json({ transaction, message: 'Transferência duplicada, iremos manter somente a última.' });
          });
        });
    } else {
      await Transaction.registerTransaction(req.body)
        .then(transaction => transaction.transfer()
          .then(response => res
            .status(200)
            .json(response))
          .catch(err => res.json(400).json(err)));
    }
  } else {
    await Transaction.registerTransaction(req.body)
      .then(transaction => transaction.transfer()
        .then(response => res
          .status(200)
          .json(response))
        .catch(err => res.json(400).json(err)));
  }
}

async function extract(req, res) {
  await Transaction.findAll({
    where: {
      [Op.or]: [
        { fromUserId: req.params.userId },
        { toUserId: req.params.userId }]
      ,
    },
    order: [
      ['id', 'DESC'],
    ],
    include: [
      'fromUser', 'toUser',
    ],
  }).then((transactions) => {
    const formattedTransactions = transactions.map((transaction) => {
      const addition = transaction.toUserId == req.params.userId;
      return { ...transaction.getValues(), addition };
    });
    res.status(200)
      .json(formattedTransactions);
  })
    .catch(error => res.status(400)
      .json({ error, message: 'Usuário sem movimentações' }));
}

module.exports = {
  transfer,
  extract,
};
