const Sequelize = require("sequelize");

module.exports = new Sequelize("simple_store", "", "", {
  host: "localhost",
  dialect: "postgres"
});
