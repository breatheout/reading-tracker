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
  "heroku_21119f7e1878890",
  "ba13f3f26f4e8b",
  "7ee12528",
  {
    host: "eu-cdbr-west-02.cleardb.net",
    dialect: "mysql",
  }
);

module.exports = sequelize;
