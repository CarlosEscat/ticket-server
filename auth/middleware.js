const User = require("../user/model");
const { toData } = require("./jwt");

function auth(req, res, next) {
  const jwt = req.body.jwt;

  console.log("TESTING JWT: ", jwt);
  if (jwt) {
    try {
      const data = toData(jwt);

      User.findByPk(data.userId)
        .then(user => {
          if (!user) return next("User does not exist");

          next();
        })
        .catch(next);
    } catch (error) {
      res.status(400).send({
        message: `Error ${error.name}: ${error.message}`
      });
    }
  } else {
    res.status(401).send({
      message: "Please supply some valid credentials"
    });
  }
}

module.exports = auth;
