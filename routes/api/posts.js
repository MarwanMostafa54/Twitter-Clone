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

router.get("/", (req, res, next) => {
  Post.find()
    .populate("postedBy")
    .populate("retweetData")
    .then(async (results) => {
      results = await User.populate(results, { path: "retweetData.postedBy" });
      res.status(200).send(results);
    })
    .catch((err) => {
      console.log("Error getting posts", err);
      res.sendStatus(400);
    });
});
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
router.put("/:id/like", async (req, res, next) => {
  const postId = req.params.id;
  const userID = req.session.user._id;

  const isLiked =
    req.session.user.likes && req.session.user.likes.includes(postId);
  const option = isLiked ? "$pull" : "$addToSet";

  req.session.user = await User.findByIdAndUpdate(
    userID,
    {
      [option]: { likes: postId },
    },
    { new: true }
  );
  const post = await Post.findByIdAndUpdate(
    postId,
    {
      [option]: { likes: userID },
    },
    { new: true }
  );

  res.status(200).send(post);
});
router.post("/:id/retweet", async (req, res, next) => {
  const postId = req.params.id;
  const userID = req.session.user._id;

  var deletedPost = await Post.findOneAndDelete({
    postedBy: userID,
    retweetData: postId,
  });
  const option = deletedPost != null ? "$pull" : "$addToSet";

  var repost = deletedPost;
  if (repost === null) {
    repost = await Post.create({ postedBy: userID, retweetData: postId });
  }

  req.session.user = await User.findByIdAndUpdate(
    userID,
    {
      [option]: { retweets: repost._id },
    },
    { new: true }
  );
  const post = await Post.findByIdAndUpdate(
    postId,
    {
      [option]: { retweetUsers: userID },
    },
    { new: true }
  );

  res.status(200).send(post);
});

module.exports = router;
