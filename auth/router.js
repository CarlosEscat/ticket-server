const { Router } = require("express");
const { toJWT, toData } = require("./jwt");
const bcrypt = require("bcrypt");
const User = require("../user/model");
const auth = require("./middleware");

const router = new Router();

router.post("/login", (req, res) => {
  const name = req.body.name;
  const password = req.body.password;

  //console.log("req.body test:", req.body);

  if (!name || !password) {
    res.status(400).send({
      message: "Please supply a valid name and password"
    });
  } else {
    User.findOne({
      where: {
        name: req.body.name
      }
    })
      .then(entity => {
        if (!entity) {
          res.status(400).send({
            message: "User name does not exist"
          });
        }

        if (bcrypt.compareSync(req.body.password, entity.password)) {
          res.send({
            jwt: toJWT({ userId: entity.id })
          });
        } else {
          res.status(400).send({
            message: "Password was incorrect"
          });
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({
          message: "Something went wrong with the login"
        });
      });
  }
});

router.get("/secret-endpoint", auth, (req, res) => {
  res.send({
    message: `Thanks for visiting the secret endpoint ${req.user.name}.`
  });
});

module.exports = router;
