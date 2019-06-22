module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .changeColumn('Transactions', 'status', {
      type: 'INTEGER USING CAST("status" as INTEGER)',
      defaultValue: 0,
      allowNull: false,
    }),

  down: (queryInterface, Sequelize) => queryInterface
    .changeColumn('Transactions', 'status', {
      type: Sequelize.STRING,
      defaultValue: 'Pendente',
      allowNull: false,
    }),
};
