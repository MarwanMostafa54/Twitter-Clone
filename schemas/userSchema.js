const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "/images/Dprofile.png" },
    likes: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    retweets: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    retweetData: { type: Schema.Types.ObjectId, ref: "Post" },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

var User = mongoose.model("User", userSchema);
module.exports = User;
