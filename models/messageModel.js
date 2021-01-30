const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  date: {
    type: String,
  },
  status: {
    type: Boolean,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
