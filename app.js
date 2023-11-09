const express = require("express");
const colors = require("colors");
const app = express();
const port = 5000;
const middlware = require("./middleware");

const server = app.listen(port, () => {
  console.log("server is listening on port ".green + port);
});
app.set("view engine", "pug");
app.set("views", "views");

//Routes
const loginRoute = require("./routes/loginroutes");
app.use("/login", loginRoute);

app.get("/", middlware.requirelogin, (req, res, next) => {
  var payload = {
    pageTitle: "home",
  };
  res.status(200).render("home", payload);
});
