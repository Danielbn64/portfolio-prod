const express = require('express');
const multipart = require('connect-multiparty');

const UserController = require("../src/controllers/user");

const router = express.Router();

router.post('/test-user', UserController.test);
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/token-verification', UserController.tokenVerify)

module.exports = router;