const { Contact } = require('../models');

function create(req, res) {
  return Contact
    .addContact(req.body)
    .then(contact => res.status(200).json({ message: 'Contato adicionado com sucesso.' }))
    .catch(error => res.status(400).json(error));
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
        }, { where: { id: contact.id } })
        .then(() => res.status(200).json({ message: 'Contato atualizado com sucesso.' }))
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
        .then(() => res.status(200).json({ message: 'Contato removido.' }))
        .catch(error => res.status(400).json(error));
    })
    .catch(error => res.status(400).json(error));
}

module.exports = {
  create,
  update,
  destroy,
};
