"use strict";
const express = require('express');
const app = express();
const nodemailer = require("nodemailer");
const port = 3001;
const router = express.Router();
const cors = require('cors');
require('dotenv').config();
let bodyParser = require('body-parser');

app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use('/', router);

let jsonParser = bodyParser.json();

async function main() {

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  });

  router.post('/send', jsonParser, async (req, res, next) => {

    let mailOptions = {
      from: 'nodemailer@webapp.com',
      to: 'delinne.weird@gmail.com',
      subject: 'New message from contact form',
      text: `You've got a new message from ${req.body.name}: "${req.body.message}". Provided contact information: ${req.body.email}, ${req.body.phone}.` 
    }
    console.log(mailOptions)

    await transporter.sendMail(mailOptions, (err, data) => err ? res.json({status: 'fail'}) : res.json({status: 'success'}) )
  })

};

main().catch(console.error);

app.listen(port, () => {
  console.log(`app is listening at http://localhost:${port}`)
});

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0' //without this throws 'Error: self signed certificate in certificate chain'
//With it ' Warning: Setting the NODE_TLS_REJECT_UNAUTHORIZED environment variable to '0' makes TLS 
//connections and HTTPS requests insecure by disabling certificate verification.'