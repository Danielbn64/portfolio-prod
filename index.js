"use strict";
const mongoose = require("mongoose");
const app = require("./app");
const port = 3000;
const fs = require("fs");

mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost:27017/portafolio")
  .then(() => {
    console.log("Conexion a base de datos establecida con exito...");

    app.listen(port, () => {
      console.log("Servidor corriendo correctamente en la url: localhost:3000");
    });
  })
  .catch((error) => console.log(error));

if (fs.existsSync("uploads")) {
  console.log("El fichero uploads ya existe!");
} else {
  fs.mkdir("uploads", () => {
    console.log("El fichero uploads ha sido creado!");
  });
}
