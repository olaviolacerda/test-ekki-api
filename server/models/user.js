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
  }, {});

  User.associate = (models) => {
    User.hasOne(models.Account, {
      foreignKey: 'userId',
      as: 'account',
    });

    User.belongsToMany(User, {
      foreignKey: 'relatingUserId',
      as: 'relatingUser',
      through: 'Contact',
    });

    User.belongsToMany(User, {
      foreignKey: 'relatedUserId',
      as: 'relatedUser',
      through: 'Contact',
    });

    User.belongsToMany(User, {
      foreignKey: 'fromUserId',
      as: 'fromUser',
      through: 'Transaction',
    });

    User.belongsToMany(User, {
      foreignKey: 'toUserId',
      as: 'toUser',
      through: 'Transaction',
    });
  };

  User.prototype.getContacts = function () {
    return new Promise((resolve, reject) => {
      this.getRelatingUser().then((relations) => {
        const contacts = relations.map(relation => ({
          contactId: relation.Contact.contactId,
          nickname: relation.Contact.nickname,
          realName: relation.name,
          phone: relation.phone,
          userId: relation.id,
        }));

        resolve(contacts);
      }).catch(err => reject(err));
    });
  };

  return User;
};
