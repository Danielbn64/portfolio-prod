"use strict";
//Crear un servidor:
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
var cookieParser = require('cookie-parser');
const app = express();

//Archivos de rutas:
const projectRoutes = require("./routes/project");
const userRoutes = require("./routes/user");
const emailRoutes = require("./routes/email");

//Middlewares:
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
var path = require('path');

// Configurar cabeceras y cors:
app.use(cors({
  origin: "http://daniload.com",
  credentials: true,
}));

//Rutas:
app.use("/", express.static("client", { redirect: false }));
app.use("/api", projectRoutes);
app.use("/api", userRoutes);
app.use("/api", emailRoutes);
app.get("*", function (req, res, next) {
  return res.sendFile(path.resolve("client/index.html"));
});

//Exportar:
module.exports = app;
