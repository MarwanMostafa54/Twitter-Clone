const express = require("express");
const colors = require("colors");
const app = express();
const port = 5000;

const server = app.listen(port, () => {
  console.log("server is listening on port ".green + port);
});
