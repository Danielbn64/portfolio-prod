const express = require('express');
const multipart = require('connect-multiparty');

const EmailController = require("../src/controllers/email");

const router = express.Router();

router.post('/envio', EmailController.sendEmail);

module.exports = router;