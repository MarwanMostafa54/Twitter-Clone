const express = require("express");
const colors = require("colors");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");

app.set("view engine", "pug");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
  res.status(200).render("register");
});
router.post("/", (req, res, next) => {
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
    password
  ) {
   
  } else {
    payload.errorMessage = "make sure each field has a valid value";
    res.status(200).render("register", payload);
  }
});
module.exports = router;
