const express = require("express");
const colors = require("colors");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../schemas/userSchema");
const session = require("session");
const bcrypt = require("bcrypt");

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "pug");
app.set("views", "views");

router.get("/", (req, res, next) => {
  const payload = {
    loginTitle: "Login",
  };
  res.status(200).render("Login", payload);
});
router.post("/", async (req, res, next) => {
  var payload = req.body;
  if (payload.logUserName != "" && payload.logPassword != "") {
    var user = await User.findOne({
      $or: [{ username: payload.logUserName }, { email: payload.logUserName }],
    }).catch((err) => {
      console.error(err);
      payload.errorMessage = "something went wrong";
      res.status(200).render("login", payload);
    });
    if (user != null) {
      var result = await bcrypt.compare(payload.logPassword, user.password);
      if (result === true) {
        req.session.user = user;
        return res.redirect("/");
      }
    }
    payload.errorMessage = "login credentials is incorrect";
    return res.status(200).render("login", payload);
  }
  payload.errorMessage = "make sure each field has a valid value";
  res.status(200).render("login", payload);
});
module.exports = router;
