const SequelizeTokenify = require('sequelize-tokenify');


module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    contactId: {
      type: DataTypes.STRING,
      unique: true,
    },
    nickname: DataTypes.STRING,
  }, { });

  Contact.associate = (models) => {
    Contact.belongsTo(models.User, {
      foreignKey: 'relatingUserId',
      as: 'relatingUser',
      onDelete: 'CASCADE',
    });

    Contact.belongsTo(models.User, {
      foreignKey: 'relatedUserId',
      as: 'relatedUser',
      onDelete: 'CASCADE',
    });
  };

  SequelizeTokenify.tokenify(Contact, {
    field: 'contactId',
    charset: 'numeric',
  });

  Contact.addContact = async (params) => {
    const { relatingUserId, relatedUserId, nickname } = params;
    const oldContact = await Contact.findOne({ where: { relatingUserId, relatedUserId } });

    if (oldContact) {
      return oldContact.update({ nickname });
    }

    return Contact.create(params);
  };

  return Contact;
};
