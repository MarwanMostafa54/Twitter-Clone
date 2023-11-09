const mongoose = require("mongoose");
class Database {
  constructor() {
    this.connect();
  }
  connect() {
    mongoose
      .connect("mongodb://127.0.0.1:27017/TwitterClone")
      .then(() => {
        console.log("database connected ".blue);
      })
      .catch((err) => {
        console.log("error connecting " + err);
      });
  }
}

module.exports = new Database();
