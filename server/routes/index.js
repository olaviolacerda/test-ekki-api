const usersController = require('../controllers').users;
const contactsController = require('../controllers').contacts;
const transactionsController = require('../controllers').transactions;

module.exports = (app) => {
  // Users
  app.post('/api/login', usersController.login);
  app.get('/api/users/:id', usersController.show);
  app.get('/api/users/:id/account', usersController.userAccount);
  app.get('/api/users/:id/contacts', usersController.userContacts);
  app.get('/api/users', usersController.list);
  app.post('/api/users', usersController.create);

  // Contacts
  app.post('/api/contacts', contactsController.create);
  app.put('/api/contacts/:contactId', contactsController.update);
  app.delete('/api/contacts/:contactId', contactsController.destroy);
  // Transactions
  app.post('/api/transactions', transactionsController.transfer);
  app.get('/api/transactions/:userId', transactionsController.extract);

  // Not Found
  app.get('*', (req, res) => res.status(404).json({
    message: 'Oops...',
  }));
};
