const mongoose = require("mongoose");
const User = require("./userSchema");

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: User,
    },
    pinned: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

var Post = mongoose.model("Post", postSchema);
module.exports = Post;
