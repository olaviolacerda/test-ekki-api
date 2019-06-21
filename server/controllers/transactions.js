const { Transaction } = require('../models');

async function transfer(req, res) {
  console.log('reeee', req.body);
  const pastTransaction = await Transaction.findOne({ where: req.body, limit: 1, order: [['createdAt', 'DESC']] });

  if (pastTransaction) {
    const pastTransactionDate = pastTransaction.createdAt.getTime();
    const actualTime = new Date().getTime();

    if (actualTime - pastTransactionDate < 120000) {
      await pastTransaction.update({ status: 'Cancelada' })
        .then(() => {
          Transaction.registerTransaction(req.body).then((transaction) => {
            Transaction.update({ status: 'Realizada' });
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

module.exports = {
  transfer,
};
