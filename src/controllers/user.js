"use strict";

const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("../../service/jwt");
const jwtobject = require("jsonwebtoken");
const key = require("../models/key");

const controller = {
  test: function (req, res) {
    return res.status(200).send({
      message: "Soy el metodo o accion test del controlador de user",
    });
  },

  register: function (req, res) {
    const user = new User();
    const params = req.body;

    if (params.email && params.password) {
      user.email = params.email;
      user.password = params.password;
      user.role = "ROLE_ADMIN";

      User.findOne({ role: user.role }, (error, issetUser) => {
        if (error) {
          res.status(500).send({ message: "Error al guardar el usuario" });
        } else {
          if (!issetUser) {
            bcrypt.hash(params.password, 10, async function (error, hash) {
              if (error) {
                res
                  .status(500)
                  .send({ message: "No se ha cifrado la contraseña" });
              } else {
                user.password = hash;
              }

              await user.save((error, userStored) => {
                if (error) {
                  res
                    .status(500)
                    .send({ message: "Error al guardar el usuario" });
                } else {
                  if (!userStored) {
                    res
                      .status(404)
                      .send({ message: "No se ha registrado el usuario" });
                  } else {
                    res.status(200).send({ user: userStored });
                  }
                }
              });
            });
          } else {
            res
              .status(200)
              .send({ message: "Solo puedes crear un usuario administrador" });
          }
        }
      });
    } else {
      res.status(200).send({ message: "Todos los campos son obligatorios" });
    }
  },

  login: function (req, res) {
    const params = req.body;
    const email = params.email;
    const password = params.password;

    User.findOne({ email: email }, (error, user) => {
      if (error) {
        res.status(500).send({ message: "Error en la petición" });
      } else {
        if (user) {
          bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch) {
              res.status(404).send({ message: "El usuario no existe" });
            } else {
              if (params.gettoken) {
                const token = jwt.createToken(user);
                res.cookie("loginToken", token, { httpOnly: true });
                res.status(200).send({
                  message: "Token generado exitosamente",
                  token: token,
                });
              } else {
                res.status(200).send({ user });
              }
            }
          });
        } else {
          res.status(404).send({ message: "El usuario no existe" });
        }
      }
    });
  },

  tokenVerify: function (req, res) {
    const responseToken = req.cookies.loginToken;
    
    try {
      const jwtdecode = jwtobject.verify(responseToken, key.secret);
      if (!jwtdecode) {
        res.status(200).send({
          message: "El token no existe o la llave es incorrecta",
          tokenValidation: false,
        });
      } else {
        const issetUser = User.findById(jwtdecode.sub, (error, issetUser) => {
          if (error) {
            res.status(403).send({
              message: "Error al validar el token",
            });
          } else {
            if (
              issetUser &&
              jwtdecode.role == "ROLE_ADMIN" &&
              jwtdecode.exp < Date.now()
            ) {
              res
                .status(200)
                .send({
                  tokenValidation: true,
                  role: "ROLE_ADMIN",
                  exp: false,
                });
            } else {
              res.status(200).send({
                message: "El token actual no es valido o esta caducado",
                tokenValidation: false,
              });
            }
          }
        });
      }
    } catch {
      res.status(200).send({
        message: "El token tiene un formato incorrecto o es invalido",
        tokenValidation: false,
      })
    }
  },
};

module.exports = controller;
