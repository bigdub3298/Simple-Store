const { Pool } = require("pg");

const connection = { host: "localhost", database: "simple_store" };
const pool = new Pool(connection);
pool.connect();

module.exports = pool;
