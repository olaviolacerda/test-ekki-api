const { Op } = require('sequelize');
const { Account, Transaction } = require('../models');


module.exports = {
  list(req, res) {
    return Account
      .findAll()
      .then(accounts => res.status(200).send(accounts))
      .catch(error => res.status(400).send(error));
  },

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
      }).then((extract) => {
        if (!extract) return res.status(200).send({ message: 'Nenhuma transferência realizada na conta solicitada' });
        return res.status(200).send(extract);
      })
      .catch(error => res.status(400).send(error));
  },

};
