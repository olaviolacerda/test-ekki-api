/* eslint-disable func-names */
const SequelizeTokenify = require('sequelize-tokenify');

module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    accountNumber: {
      type: DataTypes.STRING,
      unique: true,
    },
    balance: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      defaultValue: 1000,
    },
    limit: {
      type: DataTypes.DECIMAL(20, 2),
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
  };

  Account.prototype.deposit = function (amount) {
    const { limit } = this;
    const newLimit = Number(limit) <= 500 ? Number(limit) + amount : Number(limit);
    const limitMax = 500;

    if (newLimit > limitMax) {
      const newBalance = (Number(newLimit) + Number(this.balance)) - limitMax;
      this.update({ balance: newBalance, limit: limitMax });
    } else {
      this.update({ limit: newLimit });
    }
  };


  Account.prototype.withdraw = async function (amount) {
    const balance = Number(this.balance);
    const limit = Number(this.limit);
    const totalBalance = balance + limit;


    return new Promise((resolve, reject) => {
      if (amount < balance) {
        this.update({ balance: balance - amount });
        resolve({ status: true, account: this, message: 'Transferência realizada.' });
      } else if (amount < totalBalance) {
        this.update({ balance: 0, limit: totalBalance - amount });
        resolve({ status: true, account: this, message: 'Transferência realizada.' });
      } else {
        reject({ status: false, account: this, message: 'Saldo insuficiente.' });
      }
    });
  };

  return Account;
};
