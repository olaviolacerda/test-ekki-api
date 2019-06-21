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
    .findAll({ include: [{ model: Account, as: 'account', attributes: ['accountNumber'] }] })
    .then(users => res.status(200).json(users))
    .catch(err => res.status(400).json({ err, message: 'Não há usuários cadastrados.' }));
}

function show(req, res) {
  return User
    .findOne({ where: { id: req.params.id }, include: [{ model: Account, as: 'account', attributes: ['accountNumber'] }] })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(400).json({ err, message: 'Usuário não encontrado.' }));
}

function login(req, res) {
  return User.findOne({ where: { cpf: req.body.cpf } })
    .then(user => res.status(200).json({ user }))
    .catch(err => res.status(400).json({ err, message: 'Usuário não encontrado.' }));
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
    }).catch(err => res.status(400)
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
  show,
};
