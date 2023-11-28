const express = require("express");
const colors = require("colors");
const app = express();
const port = 5000;
const middlware = require("./middleware");
const path = require("path");
const bodyParser = require("body-parser");
const moongoose = require("./database");
const session = require("express-session");
const util = require("util");

const server = app.listen(port, () => {
  console.log("server is listening on port ".green + port);
});

app.set("view engine", "pug");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "maro",
    resave: true,
    saveUninitialized: false,
  })
);

//Routes
const loginRoute = require("./routes/loginRoutes");
app.use("/login", loginRoute);
const registerRoute = require("./routes/registerRoutes");
app.use("/register", registerRoute);
const logoutRoute = require("./routes/logoutRoutes");
app.use("/logout", logoutRoute);
const postRoute = require("./routes/postRoutes");
app.use("/post", middlware.requirelogin, postRoute);
const profileRoute = require("./routes/profileRoutes");
app.use("/profile", middlware.requirelogin, profileRoute);
//api routes
const postApiRouts = require("./routes/api/posts.js");
app.use("/api/posts", postApiRouts);

app.get("/", middlware.requirelogin, (req, res, next) => {
  var payload = {
    pageTitle: "Home",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  };
  res.status(200).render("home", payload);
});
