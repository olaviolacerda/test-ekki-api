const { Op } = require('sequelize');
const { Account, Transaction, User } = require('../models');

function extract(req, res) {
  Transaction
    .findAll({
      where: {
        [Op.or]: [
          { sourceAccountId: req.params.accountId },
          { targetAccountId: req.params.accountId }]
        ,
      },
      attributes: ['amount', 'transactionId', 'createdAt'],
      include: [{
        model: Account,
        as: 'sourceAccount',
        attributes: ['id'],
        include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
      },
      {
        model: Account,
        as: 'targetAccount',
        attributes: ['id'],
        include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
      }],
    }).then(transactions => res.status(200)
      .json(transactions))
    .catch(error => res.status(400)
      .json({ error, message: 'Nenhuma transferência encontrada na conta solicitada' }));
}

module.exports = {
  extract,
};
