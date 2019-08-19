const { Router } = require("express");
const Event = require("./model");
const router = new Router();

//Get all Events
router.get("/event", (req, res, next) =>
  Event.findAll()
    .then(events => {
      return res.json({ events: events });
    })
    .catch(error => next(error))
);

//Add one event to database
router.post("/event", (req, res, next) => {
  Event.create(req.body)
    .then(name => res.json(name))
    .catch(next);
});

//Get one event by id
router.get("/event/:Id", (req, res, next) => {
  Event.findByPk(req.params.Id)
    .then(event => {
      if (!event) {
        res.status(404).end();
      } else {
        res.json(event);
      }
    })
    .catch(next);
});

//Edit one event by id
router.put("/event/:Id", (req, res, next) => {
  Event.findByPk(req.params.Id)
    .then(event => {
      if (event) {
        return event.update(req.body).then(event => res.json(event));
      }
      return res.status(404).end();
    })
    .catch(next);
});

//Delete one event by id
router.delete("/event/:Id", (req, res, next) => {
  Event.destroy({
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
