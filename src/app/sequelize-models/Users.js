const Sequelize = require("sequelize");
const sequelize = require("../config/db.config");

const Users = sequelize.define("Users", {
  user_id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING(35),
    allowNull: false,
    unique: true,
  },
  email: {
    type: Sequelize.STRING(35),
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  access_token: {
    type: Sequelize.STRING,
  },
});

module.exports = Users;
