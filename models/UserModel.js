const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  twitterId: {
    type: String,
    required: [true, "Please provide twitterId"],
  },
  mentionTweet: {
    type: Array,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
