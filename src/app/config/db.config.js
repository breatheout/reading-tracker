/*
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
  "heroku_c6599ca5e1238af",
  "b90ff50953693d",
  "3f98b453",
  {
    host: "eu-cdbr-west-02.cleardb.net",
    dialect: "mysql",
  }
);

module.exports = sequelize;
/*
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "readingtrack",
  "readingtrack",
  "KWxHMzIwYG9OcgiziK7F",
  {
    host: "mysql.readingtracker.co.uk",
    dialect: "mysql",
    port: "3306",
  }
);

module.exports = sequelize;*/
