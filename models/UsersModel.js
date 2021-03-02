const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UsersSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = UsersModel = mongoose.model("usersModel", UsersSchema);
