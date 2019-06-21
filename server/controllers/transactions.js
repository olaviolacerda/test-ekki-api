const { Transaction, Account } = require('../models');

async function getAccounts(params) {
  const { sourceAccountId, targetAccountId } = params;
  let accountsArray = [];
  await Account.findAll({
    where: {
      id: [sourceAccountId, targetAccountId],
    },
  }).then(
    (accounts) => {
      accountsArray = accounts;
    },
  );
  return accountsArray;
}

async function transfer(req, res) {
  const pastTransaction = await Transaction.findOne({ where: req.body, limit: 1, order: [['createdAt', 'DESC']] });

  if (pastTransaction) {
    const pastTransactionDate = pastTransaction.createdAt.getTime();
    const actualTime = new Date().getTime();

    if (actualTime - pastTransactionDate < 120000) {
      await Transaction.destroy({ where: { transactionId: pastTransaction.transactionId } })
        .then(() => {
          Transaction.registerTransaction(req.body).then((transaction) => {
            res.status(200).json({ transaction, message: 'Transferência duplicada, iremos manter somente a última.' });
          });
        });
    } else {
      const accounts = getAccounts(req.body);
      await Transaction.transfer(req.body.amount, accounts)
        .then(response => res
          .status(200)
          .json(response))
        .catch(err => res.json(400).json(err));
    }
  } else {
    const accounts = getAccounts(req.body);
    await Transaction.transfer(req.body.amount, accounts)
      .then(response => res
        .status(200)
        .json(response))
      .catch(err => res.json(400).json(err));
  }
}

module.exports = {
  transfer,
};
