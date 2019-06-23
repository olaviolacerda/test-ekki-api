const { Op } = require('sequelize');
const { Transaction, User } = require('../models');

async function transfer(req, res) {
  const pastTransaction = await Transaction.findOne({ where: req.body, limit: 1, order: [['createdAt', 'DESC']] });

  if (pastTransaction) {
    const pastTransactionDate = pastTransaction.createdAt.getTime();
    const actualTime = new Date().getTime();

    if (actualTime - pastTransactionDate < 120000) {
      await Transaction.duplicatedTransaction(req, res, pastTransaction);
    } else {
      await Transaction.transfer(req, User)
        .then(resp => res.status(200).json(resp))
        .catch(err => res.status(400).json(err));
    }
  } else {
    await Transaction.transfer(req, User)
      .then(resp => res.status(200).json(resp))
      .catch(err => res.status(400).json(err));
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
    const formattedTransactions = transactions.filter((transaction) => {
      if (!(transaction.status == 2 && transaction.toUserId == req.params.userId)) {
        return transaction;
      }
    }).map((newTransactions) => {
      const addition = newTransactions.toUserId == req.params.userId;
      return {
        ...newTransactions.getValues(),
        addition,
      };
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
