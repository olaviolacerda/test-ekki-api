const usersController = require('../controllers').users;
const accountsController = require('../controllers').accounts;

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Todos API!',
  }));

  // Users
  app.post('/api/users', usersController.create);
  app.get('/api/users', usersController.list);


  // Accounts
  app.get('/api/accounts', accountsController.list);
};
