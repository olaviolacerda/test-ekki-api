const { Op } = require('sequelize');
const { Transaction } = require('../models');


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
        include: ['source', 'target'],
      }).then((transactions) => {
        let extract;
        if (transactions.length === 0) {
          extract = { message: 'Nenhuma transferência encontrada na conta solicitada' };
        } else {
          extract = transactions.map(transaction => Object.assign({}, {
            amount: transaction.amount,
            date: transaction.createdAt,
            sourceAccount: transaction.source.accountNumber,
            targetAccount: transaction.target.accountNumber,
            sourceContact: transaction.source.userId,
            targetContact: transaction.target.userId,
          }));
        }
        res.status(200).json(extract);
      })
      .catch(error => res.status(400).json(error));
  },


};
