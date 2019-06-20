const { User, Account } = require('../models');

module.exports = {
  create(req, res) {
    return User
      .create(req.body)
      .then((user) => {
        Account.create({ userId: user.id });
        res.status(200).json({ user, message: 'Usuário criado' });
      })
      .catch(error => res.status(400).json({ error, message: 'Não foi possível cadastrar o usuário.' }));
  },

  list(req, res) {
    return User
      .findAll()
      .then(users => res.status(200).json(users))
      .catch(error => res.status(400).json({ error, message: 'Não há usuários cadastrados.' }));
  },

  login(req, res) {
    return User.findOne({ where: { cpf: req.body.cpf } })
      .then(user => res.status(200).json({ user }))
      .catch(error => res.status(400).json({ error, message: 'Usuário não encontrado.' }));
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
        });
        res.status(200).json(userObj);
      })
      .catch(error => res.status(400).json({ error, message: 'Usuário não encontrado.' }));
  },

};
