const express = require("express");
const colors = require("colors");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../schemas/userSchema");
const bcrypt = require("bcrypt");
const session = require("session");

app.set("view engine", "pug");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
  res.status(200).render("register");
});
router.post("/", async (req, res, next) => {
  const fieldsToTrim = ["firstName", "lastName", "username", "email"];
  fieldsToTrim.forEach((field) => {
    if (req.body[field] !== undefined && req.body[field] !== null) {
      req.body[field] = req.body[field].trim();
    }
  });
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var payload = req.body;
  if (
    firstName !== "" &&
    username !== "" &&
    lastName !== "" &&
    email !== "" &&
    password !== ""
  ) {
    var user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    }).catch((err) => {
      console.error(err);
      payload.errorMessage = "something went wrong";
      res.status(200).render("register", payload);
    });

    if (user == null) {
      var data = req.body;
      data.password = await bcrypt.hash(password, 10);
      const newUser = await User.create(data);
      req.session.user = newUser;
      res.status(200).redirect("/");
    } else {
      if (email === user.email) {
        payload.errorMessage = "email already in use";
      } else {
        payload.errorMessage = "username already in use";
      }
      res.status(200).render("register", payload);
    }
  } else {
    payload.errorMessage = "make sure each field has a valid value";
    res.status(200).render("register", payload);
  }
});
module.exports = router;
