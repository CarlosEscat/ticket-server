const { Router } = require("express");
const Event = require("./model");
const User = require("../user/model");
const auth = require("../auth/middleware");
const router = new Router();

// Get all Events
// router.get("/event", (req, res, next) => {
//   const limit = 9;
//   const offset = 0;

//   Event.findAll({
//     limit,
//     offset
//   })
//     .then(events => {
//       return res.json({ events: events });
//     })
//     .catch(error => next(error));
// });

router.get("/event", (req, res, next) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 0;

  Promise.all([Event.count(), Event.findAll({ limit, offset })])
    .then(([total, events]) => {
      res.send({
        events,
        total
      });
    })
    .catch(error => next(error));
});

//Add one event to database
router.post("/event", auth, (req, res, next) => {
  console.log("DATA TEST: ", req.body.data);
  Event.create(req.body.data)
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

//Create a new event by user id
router.post("/users/:userId/event", (req, res, next) => {
  User.findByPk(req.params.userId)
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      return Event.create({
        ...req.body
      }).then(event => {
        res.json(event);
      });
    })
    .catch(next);
});

module.exports = router;
