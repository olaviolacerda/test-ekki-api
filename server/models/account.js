/* eslint-disable func-names */
const SequelizeTokenify = require('sequelize-tokenify');

module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    accountNumber: {
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
    field: 'accountNumber',
    charset: 'numeric',
  });

  Account.associate = (models) => {
    Account.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'user',
    });

    Account.hasMany(models.Transaction, {
      foreignKey: 'sourceAccountId',
      as: 'sourceAccount',
    });

    Account.hasMany(models.Transaction, {
      foreignKey: 'targetAccountId',
      as: 'targetAccount',
    });
  };

  Account.prototype.deposit = function (amount) {
    const newBalance = Number(this.balance) + amount;
    this.update({ balance: newBalance });
  };


  Account.prototype.withdraw = function (amount) {
    const balance = Number(this.balance);
    const limit = Number(this.limit);
    const totalBalance = balance + limit;

    let response = { status: false, account: this, message: 'Saldo insuficiente.' };

    if (amount < balance) {
      this.update({ balance: balance - amount });
      response = { status: true, account: this, message: 'Transferência realizada.' };
    } else if (amount < totalBalance) {
      this.update({ balance: 0, limit: totalBalance - amount });
      response = { status: true, account: this, message: 'Transferência realizada.' };
    }

    return response;
  };

  Account.prototype.getTransactions = async function () {
    const transactions = [];

    await this.getSourceAccount().then((sources) => {
      sources.forEach(source => transactions.push(source.getValues()));
    });

    await this.getTargetAccount().then((targets) => {
      targets.forEach(target => transactions.push(target.getValues()));
    });

    return transactions;
  };


  return Account;
};
