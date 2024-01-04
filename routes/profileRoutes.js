const express = require("express");
const colors = require("colors");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../schemas/userSchema");
const session = require("session");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

router.get("/:usernameOrId", async (req, res, next) => {
  const { usernameOrId } = req.params;
  try {
    let payload = {
      pageTitle: "User not found",
      userLoggedIn: req.session.user,
      userLoggedInJs: JSON.stringify(req.session.user),
    };
    payload.selectedTabs = " ";
    if (mongoose.Types.ObjectId.isValid(usernameOrId)) {
      payload.profileUser = await User.findById(usernameOrId);
      payload.profileUserJs = JSON.stringify(payload.profileUser);
    } else {
      payload.profileUser = await User.findOne({ username: usernameOrId });
      payload.profileUserJs = JSON.stringify(payload.profileUser);
    }
    if (payload.profileUser) {
      payload.pageTitle = payload.profileUser.username;
    }
    payload.isFollowing = false;
    if (payload.profileUser.followers.includes(payload.userLoggedIn._id)) {
      payload.isFollowing = true;
    }
    return res.status(200).render("profilePage", payload);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    return res.status(500).send(`Error fetching user data: ${error.message}`);
  }
});
router.get("/:usernameOrId/replies", async (req, res, next) => {
  const { usernameOrId } = req.params;
  try {
    let payload = {
      pageTitle: "User not found",
      userLoggedIn: req.session.user,
      userLoggedInJs: JSON.stringify(req.session.user),
    };
    if (mongoose.Types.ObjectId.isValid(usernameOrId)) {
      payload.profileUser = await User.findById(usernameOrId);
      payload.profileUserJs = JSON.stringify(payload.profileUser);
    } else {
      payload.profileUser = await User.findOne({ username: usernameOrId });
      payload.profileUserJs = JSON.stringify(payload.profileUser);
    }
    if (payload.profileUser) {
      payload.pageTitle = payload.profileUser.username;
    }
    payload.selectedTabs = "replies";
    payload.isFollowing = false;
    if (payload.profileUser.followers.includes(payload.userLoggedIn._id)) {
      payload.isFollowing = true;
    }
    return res.status(200).render("profilePage", payload);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    return res.status(500).send(`Error fetching user data: ${error.message}`);
  }
});

module.exports = router;
