const { Router } = require("express");
const Comment = require("./model");
const User = require("../user/model");
const auth = require("../auth/middleware");
const router = new Router();

//Get all comments
router.get("/comment", (req, res, next) =>
  Comment.findAll()
    .then(comments => {
      return res.json({ comments: comments });
    })
    .catch(error => next(error))
);

//Add a comment
router.post("/comment", (req, res, next) => {
  Comment.create(req.body)
    .then(name => res.json(name))
    .catch(next);
});

//Get comment by id
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

//Edit comment by id
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

//Create a new comment by user id
router.post("/users/:userId/comments", (req, res, next) => {
  User.findByPk(req.params.userId)
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      return Comment.create({
        ...req.body,
        userId: req.params.userId
      }).then(comment => {
        res.json(comment);
      });
    })
    .catch(next);
});

//Delete comment by id
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
