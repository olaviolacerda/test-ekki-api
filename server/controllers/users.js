const { User, Account } = require('../models');

module.exports = {
  create(req, res) {
    return User
      .create(req.body)
      .then((user) => {
        Account.create({ userId: user.id });
        res.status(201).send(user);
      })
      .catch(error => res.status(400).send(error));
  },

  list(req, res) {
    return User
      .findAll()
      .then(users => res.status(200).send(users))
      .catch(error => res.status(400).send(error));
  },
};
