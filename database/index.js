const Sequelize = require("sequelize");

const sequelize = new Sequelize("simple_store", "", "", {
  host: "localhost",
  dialect: "postgres"
});

module.exports = sequelize;
