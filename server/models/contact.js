module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    nickname: DataTypes.STRING,
  }, {});

  Contact.associate = (models) => {
    Contact.belongsTo(models.User, {
      foreignKey: 'relatingUserId',
      as: 'relating',
      onDelete: 'CASCADE',
    });

    Contact.belongsTo(models.User, {
      foreignKey: 'relatedUserId',
      as: 'related',
      onDelete: 'CASCADE',
    });
  };

  return Contact;
};
