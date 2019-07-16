const { sequelize } = require('../../server/models');

module.exports = () => Promise.all(Object.keys(sequelize.models)
  .map(key => sequelize.models[key]
    .destroy({ truncate: true, force: true })));
