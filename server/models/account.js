const SequelizeTokenify = require('sequelize-tokenify');

module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    identifier: {
      type: DataTypes.STRING,
      unique: true,
    },
    balance: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 1000,
    },
    limit: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 500,
    },
  }, {});

  SequelizeTokenify.tokenify(Account, {
    field: 'identifier',
    charset: 'numeric',
  });

  Account.associate = (models) => {
    Account.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };

  return Account;
};
