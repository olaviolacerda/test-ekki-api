const { Contact } = require('../models');

module.exports = {
  create(req, res) {
    const { relatingUserId, relatedUserId } = req.body;
    return Contact
      .findOrCreate({ where: relatingUserId, relatedUserId })
      .then(contact => res.status(200).send(contact))
      .catch(error => res.status(400).send(error));
  },

  list(req, res) {
    return Contact
      .findAll({ where: { relatingUserId: req.params.userId } })
      .then(contacts => res.status(200).send(contacts))
      .catch(error => res.status(400).send(error));
  },
};
