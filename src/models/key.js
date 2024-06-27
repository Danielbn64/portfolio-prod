const crypto = require("crypto");

module.exports = key = {
  secret: crypto.randomBytes(64).toString("hex"),
};
