const usersController = require('../controllers').users;
const accountsController = require('../controllers').accounts;
const contactsController = require('../controllers').contacts;

module.exports = (app) => {
  // Users
  app.get('/api/users/:id', usersController.show);
  app.get('/api/users', usersController.list);
  app.post('/api/users', usersController.create);
  // Accounts
  app.get('/api/accounts', accountsController.list);
  // Contacts
  app.post('/api/contacts', contactsController.create);
  app.get('/api/contacts/:id', contactsController.list);

  // Not Found
  app.get('*', (req, res) => res.status(404).send({
    message: 'Oops...',
  }));
};
