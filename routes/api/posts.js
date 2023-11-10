const express = require("express");
const colors = require("colors");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../../schemas/userSchema");
const Post = require("../../schemas/postSchema");
const session = require("session");
const bcrypt = require("bcrypt");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {});
router.post("/", async (req, res, next) => {
  if (!req.body.content) {
    console.log("No content");
    return res.sendStatus(404);
  }
  var postData = {
    content: req.body.content,
    postedBy: req.session.user,
  };
  Post.create(postData)
    .then(async (newPost) => {
      newPost = await User.populate(newPost, { path: "postedBy" });
      res.status(201).send(newPost);
    })
    .catch((err) => {
      console.log("Error creating post");
      res.sendStatus(400);
    });
});
module.exports = router;
