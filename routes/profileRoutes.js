const express = require("express");
const colors = require("colors");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../schemas/userSchema");
const session = require("session");
const bcrypt = require("bcrypt");

router.get("/", (req, res, next) => {
  var payload = {
    pageTitle: req.session.user.username,
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
    profileUser: req.session.user,
  };
  res.status(200).render("profilePage", payload);
});
module.exports = router;
