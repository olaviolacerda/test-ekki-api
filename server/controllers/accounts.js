const { Account } = require('../models');


function extract(req, res) {
  Account.findOne({
    where: { id: req.params.accountId },
  }).then(account => account
    .getTransactions()
    .then(transactions => res.status(200)
      .json(transactions)))
    .catch(error => res.status(400)
      .json({ error, message: 'Nenhuma transferência encontrada na conta solicitada' }));
}

module.exports = {
  extract,
};
