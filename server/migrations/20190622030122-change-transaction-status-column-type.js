module.exports = {
  up: queryInterface => queryInterface
    .changeColumn('transactions', 'status', {
      type: 'INTEGER USING CAST("status" as INTEGER)',
      defaultValue: 0,
      allowNull: false,
    }),

  down: (queryInterface, Sequelize) => queryInterface
    .changeColumn('transactions', 'status', {
      type: Sequelize.STRING,
      defaultValue: 'Pendente',
      allowNull: false,
    }),
};
