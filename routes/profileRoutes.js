const express = require("express");
const colors = require("colors");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../schemas/userSchema");
const session = require("session");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
  var payload = {
    pageTitle: req.session.user.username,
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
    profileUser: req.session.user,
  };
  res.status(200).render("profilePage", payload);
});

router.get("/:usernameOrId", async (req, res, next) => {
  const { usernameOrId } = req.params;
  try {
    let payload = {
      pageTitle: "User not found",
      userLoggedIn: req.session.user,
      userLoggedInJs: JSON.stringify(req.session.user),
      profileUser: null,
    };
    if (mongoose.Types.ObjectId.isValid(usernameOrId)) {
      payload.profileUser = await User.findById(usernameOrId);
    } else {
      payload.profileUser = await User.findOne({ username: usernameOrId });
    }
    if (payload.profileUser) {
      payload.pageTitle = payload.profileUser.username;
    }
    return res.status(200).render("profilePage", payload);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    return res.status(500).send(`Error fetching user data: ${error.message}`);
  }
});

module.exports = router;
