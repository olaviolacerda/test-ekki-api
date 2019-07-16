require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.env.development',
});

module.exports = {
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  dialect: process.env.DB_DIALECT || 'postgres',
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};