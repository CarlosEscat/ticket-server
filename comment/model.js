const Sequelize = require("sequelize");
const db = require("../db");
const Ticket = require("../user/model");

const Comment = db.define("comment", {
  name: Sequelize.STRING,
  text: Sequelize.STRING,
  ticketId: Sequelize.INTEGER
});

Comment.belongsTo(Ticket);
Ticket.hasMany(Comment);

module.exports = Comment;
