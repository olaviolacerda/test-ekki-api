module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    nickname: DataTypes.STRING,
  }, {});

  Contact.associate = (models) => {
    Contact.belongsTo(models.User, {
      foreignKey: 'relatingUserId',
      as: 'contacts',
      onDelete: 'CASCADE',
    });

    Contact.belongsTo(models.User, {
      foreignKey: 'relatedUserId',
      as: 'related',
      onDelete: 'CASCADE',
    });
  };

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
