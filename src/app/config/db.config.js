/*const mysql = require("mysql2");

module.exports = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "readingtracker",
});*/

const Sequelize = require("sequelize");

const sequelize = new Sequelize("readingtracker", "root", null, {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
