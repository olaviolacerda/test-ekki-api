const { Contact, User } = require('../models');

function create(req, res) {
  return Contact
    .addContact(req.body)
    .then(contact => res.status(200).json(contact))
    .catch(error => res.status(400).json(error));
}

function userContacts(req, res) {
  return Contact
    .findAll({
      where: { relatingUserId: req.params.userId },
      attributes: ['contactId', 'nickname'],
      include: [{ model: User, as: 'relatedUser', attributes: ['name', 'phone'] }],
    })
    .then((contacts) => {
      const contactsObj = contacts.map(contact => contact.getValues());
      res.status(200).json(contactsObj);
    }).catch(error => res.status(400).json(error));
}

function update(req, res) {
  return Contact
    .findOne({
      where:
      {
        contactId: req.params.contactId,
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
}


function destroy(req, res) {
  return Contact
    .findOne({
      where: {
        contactId: req.params.contactId,
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
}

module.exports = {
  create,
  userContacts,
  update,
  destroy,
};
