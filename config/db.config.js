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

//CLEAR DB NOT SUPPORTED
/*
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
*/
/*
READING TRACK
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

//mysql://g0r1jib4iaut30td:xoy9fk9k619cppml@clwxydcjair55xn0.chr7pe7iynqr.eu-west-1.rds.amazonaws.com:3306/bep2lbvw098rd9pn

const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: "3306",
  }
);

module.exports = sequelize;
