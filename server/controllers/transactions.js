const { Transaction } = require('../models');

module.exports = {
  async transfer(req, res) {
    let newTransaction;

    const pastTransaction = await Transaction.findOne({ where: req.body, limit: 1, order: [['createdAt', 'DESC']] });

    if (pastTransaction) {
      const pastTransactionDate = pastTransaction.createdAt.getTime();
      const actualTime = new Date().getTime();

      if (actualTime - pastTransactionDate < 120000) {
        pastTransaction.destroy({ where: { createdAt: pastTransaction.createdAt } });
        newTransaction = await Transaction
          .registerTransaction(req.body);
      } else {
        newTransaction = await Transaction
          .performTransfer(req.body);
      }
    } else {
      newTransaction = await Transaction
        .performTransfer(req.body);
    }


    return newTransaction.then(transaction => res.status(200).send(transaction))
      .catch(error => res.status(400).send(error));
  },
};
