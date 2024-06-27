"use strict";

const fs = require("fs");
const { exists } = require("../models/project");
const path = require("path");
const Project = require("../models/project");
const controller = {
  home: function (req, res) {
    return res.status(200).send({
      message: "Soy la home",
    });
  },

  test: function (req, res) {
    return res.status(200).send({
      message: "Soy el metodo o accion test del controlador de project",
    });
  },

  //Guardar proyectos dentro de la base de datos:
  saveProject: function (req, res) {
    const project = new Project();
    let params = req.body;
    project.name = params.name;
    project.description = params.description;
    project.category = params.category;
    project.year = params.year;
    project.languages = params.languages;
    project.codeLink = params.codeLink;
    project.webLink = params.webLink;
    project.image = null;

    project.save((error, projectStored) => {
      if (error)
        return res
          .status(500)
          .send({ message: "Error al guardar el documento." });
      if (!projectStored)
        return res
          .status(404)
          .send({ message: "No se ha podido guardar el proyecto." });
      else {
        return res.status(200).send({ project: projectStored });
      }
    });
  },

  //Devuelve un proyecto de la base de datos:
  getProject: function (req, res) {
    let projectId = req.params.id;
    if (projectId == null)
      return res.status(404).send({ message: "El proyecto no existe." });

    Project.findById(projectId, (error, project) => {
      if (error)
        return res
          .status(500)
          .send({ message: "Error al devolver los datos." });
      if (!project)
        return res.status(404).send({ message: "El proyecto no existe." });
      else {
        return res.status(200).send({
          project,
        });
      }
    });
  },

  //Listar todos los proyectos:
  getProjects: function (req, res) {
    Project.find()
      .sort("-year")
      .exec((error, projects) => {
        if (error)
          return res
            .status(500)
            .send({ message: "Error al devolver los datos." });
        if (!projects)
          return res
            .status(404)
            .send({ message: "No hay proyectos para mostrar." });
        else {
          return res.status(200).send({ projects });
        }
      });
  },

  //Actualizar un proyecto:
  updateProject: function (req, res) {
    let projectId = req.params.id;
    var update = req.body;

    Project.findByIdAndUpdate(
      projectId,
      update,
      { new: true },
      (error, projectUpdated) => {
        if (error)
          return res.status(500).send({ message: "Error al actualizar" });
        if (!projectUpdated)
          return res
            .status(404)
            .send({ message: "No existe el proyecto para actualizar" });
        else {
          return res.status(200).send({
            project: projectUpdated,
          });
        }
      }
    );
  },

  //Eliminar un proyecto:
  deleteProject: function (req, res) {
    let projectId = req.params.id;
    Project.findByIdAndRemove(projectId, (error, projectRemoved) => {
      if (error)
        return res
          .status(500)
          .send({ message: "No se ha podido borrar el proyecto" });
      if (!projectRemoved)
        return res
          .status(404)
          .send({ message: "No se puede eliminar el proyecto" });
      else {
        return res.status(200).send({
          project: projectRemoved,
        });
      }
    });
  },

  //Subir una imagen:
  uploadImage: function (req, res) {
    let projectId = req.params.id;
    var fileName = "Imagen no subida...";

    if (req.files) {
      var filePath = req.files.image.path;
      var fileSplit = filePath.split("/");
      var fileName = fileSplit[1];
      var extSplit = fileName.split(".");
      var fileExt = extSplit[1];
      if (
        fileExt == "png" ||
        fileExt == "jpg" ||
        fileExt == "jpeg" ||
        fileExt == "gif"
      ) {
        Project.findByIdAndUpdate(
          projectId,
          { image: fileName },
          { new: true },
          (error, projectUpdated) => {
            if (error)
              return res
                .status(500)
                .send({ message: "La imagen no se ha subido" });
            if (!projectUpdated)
              return res.status(404).send({
                message: "El proyecto no existe y no se ha asignado la imagen",
              });
            else {
              return res.status(200).send({
                project: projectUpdated,
              });
            }
          }
        );
      } else {
        fs.unlink(filePath, (error) => {
          return res.status(200).send({ message: "La extensión no es válida" });
        });
      }
    } else {
      return res.status(200).send({
        message: fileName,
      });
    }
  },

  getImageFile: function (req, res) {
    var file = req.params.image;
    var pathFile = "./uploads/" + file;

    fs.exists(pathFile, (exists) => {
      if (exists) {
        return res.sendFile(path.resolve(pathFile));
      } else {
        return res.status(200).send({
          message: "No existe la imagen",
        });
      }
    });
  },
};

module.exports = controller;
