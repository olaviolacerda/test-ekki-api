const usersController = require('../controllers').users;
const accountsController = require('../controllers').accounts;

module.exports = (app) => {
  // Users
  app.get('/api/users/:id', usersController.show);
  app.get('/api/users', usersController.list);
  app.post('/api/users', usersController.create);
  // Accounts
  app.get('/api/accounts', accountsController.list);

  // Not Found
  app.get('*', (req, res) => res.status(404).send({
    message: 'Oops...',
  }));
};
