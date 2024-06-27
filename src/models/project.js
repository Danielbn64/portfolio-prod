"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var ProjectSchema = Schema({
  name: String,
  description: String,
  category: String,
  year: Number,
  languages: String,
  codeLink: String,
  webLink: String,
  image: String,
});

module.exports = mongoose.model("Project", ProjectSchema); //Primer parametro: la entidad, segundo parametro: el
//esquema
