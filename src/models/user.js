"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  email: String,
  password: String,
  role: String,
});

module.exports = mongoose.model("user", UserSchema);
