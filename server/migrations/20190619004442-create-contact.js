

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('contacts', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    contact_id: {
      type: Sequelize.STRING,
      unique: true,
    },
    nickname: {
      type: Sequelize.STRING,
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    relating_user_id: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'users',
        key: 'id',
        as: 'relatingUserId',
        through: 'Contact',
      },
    },
    related_user_id: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'users',
        key: 'id',
        as: 'relatedUserId',
        through: 'Contact',
      },
    },
  }),
  down: queryInterface => queryInterface.dropTable('contacts'),
};
