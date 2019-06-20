const { Contact } = require('../models');

module.exports = {
  create(req, res) {
    return Contact
      .addContact(req.body)
      .then(contact => res.status(200).json(contact))
      .catch(error => res.status(400).json(error));
  },

  list(req, res) {
    return Contact
      .findAll({ where: { relatingUserId: req.params.userId } })
      .then(contacts => res.status(200).json(contacts))
      .catch(error => res.status(400).json(error));
  },

  update(req, res) {
    return Contact
      .findOne({
        where:
        {
          relatingUserId: req.body.relatingUserId,
          relatedUserId: req.body.relatedUserId,
        },
      })
      .then((contact) => {
        if (!contact) {
          return res.status(404).json({
            message: 'Contato não encontrado.',
          });
        }
        return contact
          .update({
            nickname: req.body.nickname || contact.nickname,
          })
          .then(() => res.status(200).json(contact))
          .catch(error => res.status(400).json(error));
      })
      .catch(error => res.status(400).json(error));
  },


  destroy(req, res) {
    return Contact
      .findOne({ where: { id: req.params.contactId } })
      .then((contact) => {
        if (!contact) {
          return res.status(404).json({
            message: 'Contato não encontrado.',
          });
        }
        return contact
          .destroy()
          .then(() => res.status(200).json(contact))
          .catch(error => res.status(400).json(error));
      })
      .catch(error => res.status(400).json(error));
  },

};
