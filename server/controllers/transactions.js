const models = require('../models');
const { createTransfer } = require('../services/transactionService');


module.exports = {
  async transfer(req, res) {
    const pastTransaction = await models.Transaction.findOne({ where: req.body, limit: 1, order: [['createdAt', 'DESC']] });

    if (pastTransaction) {
      const pastTransactionDate = pastTransaction.createdAt.getTime();
      const actualTime = new Date().getTime();

      if (actualTime - pastTransactionDate < 120000) {
        await models.Transaction.destroy({ where: { createdAt: pastTransaction.createdAt } })
          .then(() => {
            models.Transaction.registerTransaction(req.body).then((transaction) => {
              res.status(200).json({ transaction, message: 'Transferência duplicada, iremos manter somente a última.' });
            });
          });
      } else {
        await createTransfer(models, req, res);
      }
    } else {
      await createTransfer(models, req, res);
    }
  },
};
