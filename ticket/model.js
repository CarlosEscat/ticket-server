const Sequelize = require("sequelize");
const db = require("../db");
const Event = require("../event/model");
const User = require("../user/model");

const Ticket = db.define("ticket", {
  price: Sequelize.INTEGER,
  description: Sequelize.STRING,
  picture: Sequelize.STRING,
  eventId: Sequelize.INTEGER,
  userId: Sequelize.INTEGER
});

Ticket.belongsTo(Event);
Ticket.belongsTo(User);
Event.hasMany(Ticket);
User.hasMany(Ticket);

module.exports = Ticket;
