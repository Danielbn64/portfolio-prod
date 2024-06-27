'use strict'

const express = require('express');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: './uploads' })

const ProjectController = require('../src/controllers/project');

const router = express.Router();

router.get('/home', ProjectController.home);
router.post('/test', ProjectController.test);
router.post('/save-project', ProjectController.saveProject);
router.get('/project/:id?', ProjectController.getProject);
router.get('/projects', ProjectController.getProjects);
router.put('/project-updated/:id', ProjectController.updateProject);
router.delete('/project-delete/:id', ProjectController.deleteProject);
router.post('/upload-image/:id', multipartMiddleware, ProjectController.uploadImage);
router.get('/get-image/:image', ProjectController.getImageFile);
module.exports = router;