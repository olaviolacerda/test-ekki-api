const { User, Account } = require('../models');

module.exports = {
  create(req, res) {
    return User
      .create(req.body)
      .then((user) => {
        Account.create({ userId: user.id });
        res.status(200).json({ user, message: 'User criado' });
      })
      .catch(error => res.status(400).json(error.errors));
  },

  list(req, res) {
    return User
      .findAll()
      .then(users => res.status(200).json(users))
      .catch(error => res.status(400).json(error));
  },

  login(req, res) {
    return User.findOne({ where: { cpf: req.body.cpf } })
      .then(user => res.status(200).json(user))
      .catch(error => res.status(400).json(error));
  },

  userInfo(req, res) {
    return User
      .userInfo(req.params.id)
      .then(async (user) => {
        const userObj = Object.assign({}, {
          id: user.id,
          name: user.name,
          cpf: user.cpf,
          phone: user.phone,
          account: user.account,
          contacts: user.contacts.map(contact => Object.assign(
            {},
            {
              id: contact.id,
              name: contact.name,
              phone: contact.phone,
              nickname: contact.Contact.nickname,
            },
          )),
        });
        res.status(200).json(userObj);
      })
      .catch(error => res.status(400).json(error));
  },

};
