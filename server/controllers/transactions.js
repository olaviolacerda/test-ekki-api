const models = require('../models');
const { createTransfer } = require('../services/transactionService');


module.exports = {
  async transfer(req, res) {
    const pastTransaction = await models.Transaction.findOne({ where: req.body, limit: 1, order: [['createdAt', 'DESC']] });

    if (pastTransaction) {
      const pastTransactionDate = pastTransaction.createdAt.getTime();
      const actualTime = new Date().getTime();

      if (actualTime - pastTransactionDate < 120000) {
        await models.Transaction.destroy({ where: { createdAt: pastTransaction.createdAt } });

        await models.Transaction
          .registerTransaction(req.body)
          .then(() => {
            res.status(200).json({ message: 'Atenção: Você está tentando realizar uma transferência duplicada.' });
          }).catch(error => res.status(400).json(error));
      } else {
        await createTransfer(models, req, res);
      }
    } else {
      await createTransfer(models, req, res);
    }
  },
};
