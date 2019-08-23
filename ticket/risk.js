const Ticket = require("./model");
const User = require("../user/model");
const Comment = require("../comment/model");

function risk(ticketId) {
  let risk = 0;

  ////ticket is the only ticket of the author
  Ticket.findOne({
    where: {
      id: ticketId
    }
  }).then(ticket => {
    Ticket.findAll({ where: { userId: ticket.userId } }).then(userTickets => {
      if (userTickets.length === 1) {
        risk = risk + 10;
        return console.log("Risk: ", risk);
      } else {
        return console.log("Risk: ", risk);
      }
    });
  });
}

module.exports = risk;
