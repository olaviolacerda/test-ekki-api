/* eslint-disable func-names */
/* eslint-disable consistent-return */

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Nome de usuário não pode ser vazio.',
        },
      },
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        rightLenght(value, next) {
          if (value.length !== 11) return next('CPF inválido. Revise o número de digitos.');
          next();
        },
        notEmpty: {
          msg: 'CPF é obrigatório',
        },
        isUnique(value, next) {
          User.findOne({
            where: sequelize.and({ cpf: value }),
          })
            // eslint-disable-next-line prefer-arrow-callback
            .done(function (user, error) {
              if (user) { return next('CPF já está em uso!'); }

              if (error) { return next(error); }

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
          msg: 'Telefone não pode ser vazio.',
        },
      },
    },
  }, {
    scopes: {
      withAccount() {
        return {
          include: sequelize.models.UserCategory,
        };
      },
    },
  });

  User.associate = (models) => {
    User.hasOne(models.Account, {
      foreignKey: 'userId',
      as: 'account',
    });

    User.belongsToMany(User, {
      foreignKey: 'relatingUserId',
      as: 'contacts',
      through: 'Contact',
    });

    User.belongsToMany(User, {
      foreignKey: 'relatedUserId',
      as: 'related',
      through: 'Contact',
    });
  };

  User.userInfo = id => User.findOne({
    where: { id },
    include: ['account', 'contacts'],
  });


  return User;
};
