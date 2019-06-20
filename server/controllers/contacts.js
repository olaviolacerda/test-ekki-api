const { Contact, User } = require('../models');

module.exports = {
  create(req, res) {
    return Contact
      .addContact(req.body)
      .then(contact => res.status(200).json(contact))
      .catch(error => res.status(400).json(error));
  },

  userContacts(req, res) {
    return Contact
      .findAll({ where: { relatingUserId: req.params.userId }, include: ['relatedUser'] })
      .then((contacts) => {
        const contactsObj = contacts.map(contact => Object.assign(
          {},
          {
            id: contact.relatedUser.id,
            name: contact.relatedUser.name,
            phone: contact.relatedUser.phone,
            nickname: contact.nickname,
          },
        ));

        res.status(200).json(contactsObj);
      }).catch(error => res.status(400).json(error));
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
      .findOne({
        where: {
          relatingUserId: req.body.relatingUserId,
          relatedUserId: req.params.contactId,
        },
      })
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
