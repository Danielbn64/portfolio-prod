"use strict";

const jwt = require("jwt-simple");
const moment = require("moment");
const key = require("../src/models/key");

exports.createToken = function (user) {
  const payload = {
    sub: user._id,
    email: user.email,
    role: user.role,
    iat: moment().unix(),
    exp: moment().add(30, "day").unix(),
  };

  return jwt.encode(payload, key.secret);
};

exports.decoderToken = function (token, key) {
  if (token && key) {
    return jwt.decode(token, key);
  } else {
    return false;
  }
};
