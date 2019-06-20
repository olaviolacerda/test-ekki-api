

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Transactions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    transactionId: {
      type: Sequelize.STRING,
      unique: true,
    },
    amount: {
      type: Sequelize.BIGINT,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    sourceAccountId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Accounts',
        key: 'id',
        as: 'sourceAccountId',
      },
    },
    targetAccountId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Accounts',
        key: 'id',
        as: 'targetAccountId',
      },
    },
  }),
  down: queryInterface => queryInterface.dropTable('Transactions'),
};
