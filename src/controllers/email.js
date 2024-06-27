"use strict";

const nodeMailer = require("nodemailer");

const controller = {
  sendEmail: function (req, res) {
    let body = req.body;
    let config = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      post: 465,
      secure: true,
      auth: {
        user: "censored@censored.com",
        pass: "censored",
      },
    });

    const options = {
      from: '"Fred Foo 👻" <censored@censored.com>',
      to: "censoredd@censored.com",
      subject: body.subject,
      text: body.message,
    };

    config.sendMail(options, function (error, result) {
      if (error) {
        console.log("fallo");
        return res.json({ ok: false, message: error });
      } else {
        return res.json({
          ok: true,
          message: result,
        });
      }
    });
  },
};

module.exports = controller;
