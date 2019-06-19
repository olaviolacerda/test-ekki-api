

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Contacts', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    nickname: {
      type: Sequelize.STRING,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    relatingUserId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'relatingUserId',
        through: 'Contact',
      },
    },
    relatedUserId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'relatedUserId',
        through: 'Contact',
      },
    },
  }),
  down: queryInterface => queryInterface.dropTable('Contacts'),
};
