const Sequelize = require("sequelize");

const sequelize = new Sequelize("simple_store", "", "", {
  host: "localhost",
  dialect: "postgres",
  logging: false
});

module.exports = sequelize;
