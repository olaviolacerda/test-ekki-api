const { Transaction, Account } = require('../models');

module.exports = {
  async transfer(req, res) {
    let newTransaction;

    const pastTransaction = await Transaction.findOne({ where: req.body, limit: 1, order: [['createdAt', 'DESC']] });

    if (pastTransaction) {
      const pastTransactionDate = pastTransaction.createdAt.getTime();
      const actualTime = new Date().getTime();

      if (actualTime - pastTransactionDate < 120000) {
        Transaction.destroy({ where: { createdAt: pastTransaction.createdAt } });
        newTransaction = await Transaction
          .registerTransaction(req.body);
      } else {
        await Transaction
          .registerTransaction(req.body).then((transaction) => {
            Account.transfer(transaction);
          });
      }
    } else {
      await Transaction
        .registerTransaction(req.body).then((transaction) => {
          Account.transfer(transaction);
        });
    }

    return newTransaction.then(transaction => res.status(200).send({ ...transaction, message: 'baaaaaaaaaah' }))
      .catch(error => res.status(400).send(error));
  },
};
