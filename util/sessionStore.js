const session = require("express-session");
const sequelizeStore = require("connect-session-sequelize")(session.Store);
const db = require("../database");

const store = new sequelizeStore({ db, tableName: "userSessions" });

const sessionConfig = {
  secret: process.env.SECRET,
  store,
  resave: false,
  saveUninitialized: false
};

exports.store = store;
exports.configureSession = () => {
  return session(sessionConfig);
};
