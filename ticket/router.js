const { Router } = require("express");
const Ticket = require("./model");
const router = new Router();

router.get("/ticket", (req, res, next) =>
  Ticket.findAll()
    .then(tickets => {
      return res.json({ tickets: tickets });
    })
    .catch(error => next(error))
);

router.post("/ticket", (req, res, next) => {
  Ticket.create(req.body)
    .then(name => res.json(name))
    .catch(next);
});

router.get("/ticket/:Id", (req, res, next) => {
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

router.put("/ticket/:Id", (req, res, next) => {
  Ticket.findByPk(req.params.Id)
    .then(ticket => {
      if (ticket) {
        return ticket.update(req.body).then(ticket => res.json(ticket));
      }
      return res.status(404).end();
    })
    .catch(next);
});

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

module.exports = router;
