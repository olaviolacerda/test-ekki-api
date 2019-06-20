const usersController = require('../controllers').users;
const accountsController = require('../controllers').accounts;
const contactsController = require('../controllers').contacts;
const transactionsController = require('../controllers').transactions;

module.exports = (app) => {
  // Users
  app.get('/api/users/:id', usersController.show);
  app.get('/api/users', usersController.list);
  app.post('/api/users', usersController.create);
  // Accounts
  app.get('/api/accounts', accountsController.list);
  app.get('/api/accounts/transactions/:accountId', accountsController.extract);
  // Contacts
  app.post('/api/contacts', contactsController.create);
  app.put('/api/contacts/:contactId', contactsController.update);
  app.get('/api/contacts/:userId', contactsController.list);
  app.delete('/api/contacts/:contactId', contactsController.destroy);
  // Transactions
  app.post('/api/transactions', transactionsController.transfer);
  // app.get('/api/transactions', transactionsController.list);


  // Not Found
  app.get('*', (req, res) => res.status(404).send({
    message: 'Oops...',
  }));
};
