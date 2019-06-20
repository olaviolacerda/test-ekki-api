const { User, Account } = require('../models');

function create(req, res) {
  return User
    .create(req.body)
    .then((user) => {
      Account.create({ userId: user.id });
      res.status(200).json({ user, message: 'Usuário criado' });
    })
    .catch(error => res.status(400).json({ error, message: 'Não foi possível cadastrar o usuário.' }));
}

function list(req, res) {
  return User
    .findAll()
    .then(users => res.status(200).json(users))
    .catch(error => res.status(400).json({ error, message: 'Não há usuários cadastrados.' }));
}

function login(req, res) {
  return User.findOne({ where: { cpf: req.body.cpf } })
    .then(user => res.status(200).json({ user }))
    .catch(error => res.status(400).json({ error, message: 'Usuário não encontrado.' }));
}

function userAccount(req, res) {
  return User
    .findOne({ where: { id: req.params.id } })
    .then((user) => {
      user.getAccount()
        .then((account) => {
          account.getTransactions();
          return res.status(200)
            .json(account.getValues());
        });
    }).catch(error => res.status(400)
      .json({ message: 'Conta inexistente.' }));
}

function userContacts(req, res) {
  return User
    .findOne({ where: { id: req.params.id } })
    .then((user) => {
      user.getContacts()
        .then(account => res.status(200)
          .json(account));
    }).catch(error => res.status(400)
      .json(error));
}

module.exports = {
  create,
  list,
  userContacts,
  userAccount,
  login,
};
