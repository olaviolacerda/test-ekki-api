const { Account } = require('../models');

module.exports = {
  list(req, res) {
    return Account
      .findAll()
      .then(accounts => res.status(200).send(accounts))
      .catch(error => res.status(400).send(error));
  },
};
