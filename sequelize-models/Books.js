const Sequelize = require("sequelize");
const sequelize = require("../config/db.config");

const Books = sequelize.define("Books", {
  bookId: {
    type: Sequelize.STRING(25),
    allowNull: false,
  },
  shelf: Sequelize.STRING(12),
  title: Sequelize.STRING,
  pageCount: Sequelize.INTEGER,
  authors: Sequelize.STRING,
  genre: Sequelize.STRING,
  dateStart: Sequelize.STRING,
  dateFinished: Sequelize.STRING,
  cover: Sequelize.STRING,
  notes: Sequelize.TEXT,
  rating: Sequelize.FLOAT,
  username: Sequelize.STRING,
});

module.exports = Books;
