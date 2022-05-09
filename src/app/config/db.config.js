/*const mysql = require("mysql2");

module.exports = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "readingtracker",
});*/

/*const Sequelize = require("sequelize");

const sequelize = new Sequelize("readingtracker", "root", null, {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;*/

const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "heroku_7643ec736354xxx",
  "b7e2437887xxxa",
  "200xxx6",
  {
    host: "heroku_7643ec736354xxx",
    dialect: "mysql",
  }
);

module.exports = sequelize;
