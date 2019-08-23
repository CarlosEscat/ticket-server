const { Router } = require("express");
const Ticket = require("./model");
const User = require("../user/model");
const Comment = require("../comment/model");
const auth = require("../auth/middleware");
const { toData } = require("../auth/jwt");
const risk = require("./risk");
const router = new Router();

//Get all tickets
router.get("/ticket", (req, res, next) =>
  Ticket.findAll()
    .then(tickets => {
      return res.json({ tickets: tickets });
    })
    .catch(error => next(error))
);

//Add one ticket to database
router.post("/ticket", (req, res, next) => {
  Ticket.create(req.body)
    .then(name => res.json(name))
    .catch(next);
});

//Get a ticket information by id
router.get("/ticket/:Id", (req, res, next) => {
  const ticketId = req.params.Id;
  console.log("TICKETID TEST:", req.params.Id);
  risk(ticketId);
  Ticket.findByPk(req.params.Id)
    .then(ticket => {
      if (!ticket) {
        res.status(404).end();
      } else {
        res.json(ticket);
      }
    })
    .catch(next);
});

//Edit a ticket information by id
// router.put("/ticket/:Id", (req, res, next) => {
//   Ticket.findByPk(req.params.Id)
//     .then(ticket => {
//       if (ticket) {
//         return ticket.update(req.body).then(ticket => res.json(ticket));
//       }
//       return res.status(404).end();
//     })
//     .catch(next);
// });

router.put("/ticket/:Id", async (req, res, next) => {
  const { jwt, data } = req.body;
  console.log("**********************request.body.data test:", data);
  const { userId } = toData(jwt);
  const user = await User.findByPk(userId);
  console.log("USER TEST: ", user.dataValues.id);
  const ticId = data.userId;
  console.log("TICKETID TEST: ", ticId);
  if (user.dataValues.id === ticId) {
    console.log("++++++++++ENTERED++++++++");
    Ticket.findByPk(req.params.Id)
      .then(ticket => {
        if (ticket) {
          return ticket.update(data).then(ticket => res.json(ticket));
        }
        return res.status(404).end();
      })
      .catch(next);
  } else {
    return res.status(401).end();
  }
});

//Delete one ticket by id
router.delete("/ticket/:Id", (req, res, next) => {
  Ticket.destroy({
    where: {
      id: req.params.Id
    }
  })
    .then(numDeleted => {
      if (numDeleted) {
        res.send({ numDeleted });
      }
      return res.status(404).end();
    })
    .catch(next);
});

//Get list of tickets from event id
router.get("/event/:eventId/tickets", (req, res, next) => {
  Ticket.findAll({ where: { eventId: req.params.eventId } })
    .then(tickets => {
      res.json(tickets);
    })
    .catch(next);
});

//Get a single ticket from an event
router.get("/event/:eventId/tickets/:ticketId", (req, res, next) => {
  Ticket.findOne({
    where: {
      id: req.params.ticketId,
      eventId: req.params.eventId
    }
  })
    .then(ticket => {
      if (ticket) {
        return res.json(ticket);
      }
      return res.status(404).end();
    })
    .catch(next);
});

//Create a new ticket by user id
router.post("/users/:userId/tickets", (req, res, next) => {
  User.findByPk(req.params.userId)
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      return Ticket.create({
        ...req.body,
        userId: req.params.userId
      }).then(ticket => {
        res.json(ticket);
      });
    })
    .catch(next);
});

//Get list of tickets from a user id
router.get("/user/:userId/tickets", (req, res, next) => {
  Ticket.findAll({ where: { userId: req.params.userId } })
    .then(tickets => {
      res.json(tickets);
    })
    .catch(next);
});

//Get a single ticket from a user
router.get("/user/:userId/tickets/:ticketId", (req, res, next) => {
  Ticket.findOne({
    where: {
      id: req.params.ticketId,
      userId: req.params.userId
    }
  })
    .then(ticket => {
      if (ticket) {
        return res.json(ticket);
      }
      return res.status(404).end();
    })
    .catch(next);
});

//Edit a users ticket by id
router.put("/user/:userId/tickets/:ticketId", (req, res, next) => {
  Ticket.findOne({
    where: {
      id: req.params.ticketId,
      userId: req.params.userId
    }
  })
    .then(ticket => {
      if (ticket) {
        return ticket.update(req.body).then(ticket => res.json(ticket));
      }
      return res.status(404).end();
    })
    .catch(next);
});

// Delete a user's ticket by id
router.delete("/users/:userId/tickets/:ticketId", (req, res, next) => {
  Ticket.destroy({
    where: {
      id: req.params.ticketId,
      userId: req.params.userId
    }
  })
    .then(numDeleted => {
      if (numDeleted) {
        return res.status(204).end();
      }
      return res.status(404).end();
    })
    .catch(next);
});

module.exports = router;
