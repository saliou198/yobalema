const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: process.env.DB_SSL === 'true'
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
});

const connectDB = async () => {
  await sequelize.authenticate();
  return sequelize;
};

module.exports = { sequelize, connectDB };
