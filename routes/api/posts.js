const express = require("express");
const colors = require("colors");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../../schemas/userSchema");
const session = require("session");
const bcrypt = require("bcrypt");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {});
router.post("/", async (req, res, next) => {
  if (!req.body.content) {
    console.log("No content");
    return res.sendStatus(404);
  }
});
module.exports = router;
