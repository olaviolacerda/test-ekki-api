const { Op } = require('sequelize');
const { Transaction, Account } = require('../models');


module.exports = {
  extract(req, res) {
    return Transaction
      .findAll({
        where: {
          [Op.or]: [
            {
              sourceAccountId: req.params.accountId,
            }, {
              targetAccountId: req.params.accountId,
            },
          ],
        },
        attributes: ['transactionId', 'amount', 'createdAt'],
        include: [{
          model: Account,
          as: 'target',
          attributes: ['accountNumber', 'userId'],
        }],
      }).then((transactions) => {
        let extract;
        if (transactions.length === 0) {
          extract = { message: 'Nenhuma transferência encontrada na conta solicitada' };
        } else {
          extract = transactions.map(transaction => transaction.getValues());
        }
        res.status(200).json(extract);
      })
      .catch(error => res.status(400).json(error));
  },


};
