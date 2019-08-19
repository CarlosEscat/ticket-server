const { Router } = require("express");
const Comment = require("./model");
const router = new Router();

router.get("/comment", (req, res, next) =>
  Comment.findAll()
    .then(comments => {
      return res.json({ comments: comments });
    })
    .catch(error => next(error))
);

router.post("/comment", (req, res, next) => {
  Comment.create(req.body)
    .then(name => res.json(name))
    .catch(next);
});

router.get("/comment/:Id", (req, res, next) => {
  Comment.findByPk(req.params.Id)
    .then(comment => {
      if (!comment) {
        res.status(404).end();
      } else {
        res.json(comment);
      }
    })
    .catch(next);
});

router.put("/comment/:Id", (req, res, next) => {
  Comment.findByPk(req.params.Id)
    .then(comment => {
      if (comment) {
        return comment.update(req.body).then(comment => res.json(comment));
      }
      return res.status(404).end();
    })
    .catch(next);
});

//Get list of comments of a ticket id
router.get("/ticket/:ticketId/comments", (req, res, next) => {
  Comment.findAll({ where: { ticketId: req.params.ticketId } })
    .then(comments => {
      res.json(comments);
    })
    .catch(next);
});

router.delete("/comment/:Id", (req, res, next) => {
  Comment.destroy({
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
