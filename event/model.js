const Sequelize = require("sequelize");
const db = require("../db");
//const Ticket = require("../ticket/model");

const Event = db.define("event", {
  name: Sequelize.STRING,
  description: Sequelize.STRING,
  logo: Sequelize.STRING,
  start_date: Sequelize.DATE,
  end_date: Sequelize.DATE
});

// Ticket.belongsTo(Event);
// Event.hasMany(Ticket);
//console.log('Event.tickets test', Event.Tickets)
//Event.Tickets = [{ price, description, picture }];

module.exports = Event;
