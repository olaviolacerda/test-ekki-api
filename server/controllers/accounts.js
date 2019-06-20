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
        let extract = transactions;
        if (extract.length === 0) {
          extract = { message: 'Nenhuma transferência encontrada na conta solicitada' };
        }

        return res.status(200).json(extract);
      })
      .catch(error => res.status(400).json(error));
  },


};
