const express = require("express");
const colors = require("colors");
const app = express();
const port = 5000;
const middlware = require("./middleware");
const path = require("path");
const bodyParser = require("body-parser");
const moongoose = require("./database");
const server = app.listen(port, () => {
  console.log("server is listening on port ".green + port);
});

app.set("view engine", "pug");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

//Routes
const loginRoute = require("./routes/loginRoutes");
app.use("/login", loginRoute);
const registerRoute = require("./routes/registerRoutes");
app.use("/register", registerRoute);

app.get("/", middlware.requirelogin, (req, res, next) => {
  var payload = {
    pageTitle: "home",
  };
  res.status(200).render("home", payload);
});
