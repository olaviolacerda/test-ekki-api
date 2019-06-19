/* eslint-disable func-names */
/* eslint-disable consistent-return */

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Nome é obrigatório',
        },
      },
    },
    cpf: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'CPF é obrigatório',
        },
        isUnique(value, next) {
          User.findOne({
            where: sequelize.and({ cpf: value }),
          })
            // eslint-disable-next-line prefer-arrow-callback
            .done(function (error, user) {
              if (error) { return next(error); }

              if (user) { return next('CPF já está em uso!'); }

              next();
            });
        },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Telefone é obrigatório',
        },
      },
    },
  });

  User.associate = (models) => {
    User.hasOne(models.Account, {
      foreignKey: 'userId',
      as: 'account',
    });
  };

  User.show = id => User.findOne({
    where: { id },
    include: 'account',
  });

  return User;
};
