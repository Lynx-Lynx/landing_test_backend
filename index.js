const express = require('express');
const app = express();
const nodemailer = require("nodemailer");
const port = 3001;
const router = express.Router();
const cors = require('cors');
require('dotenv').config();

app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use('/', router);
app.use(express.json());

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

router.post('/send', (req, res, next) => {
  let name = req.body.name
  let email = req.body.email
  let message = req.body.message
  let content = `name: ${name} \n email: ${email} \n message: ${message} `

  let mailOptions = {
    from: 'nodemailer@webapp.com',
    to: 'delinne.weird@gmail.com',
    subject: 'New message from contact form',
    text: content
  }

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      res.json({
        status: 'fail'
      })
    } else {
      res.json({
       status: 'success'
      })
    }
  })
})

// router.post('/send', (req, res, next) => {
//   let name = req.body.name;
//   let email = req.body.email;
//   let message = req.body.message;
//   let content = `name: ${name} \n email: ${email} \n message: ${message} `

//   let mailOptions = {
//     from: 'nodemailer@webapp.com',
//     to: 'delinne.weird@gmail.com',
//     subject: 'New message from contact form',
//     text: content
//   });

// transporter.sendMail(mailOptions, function(err, data) {
//   if (err) {
//     console.log("Error " + err);
//   } else {
//     console.log("Email sent successfully");
//   }
// });


app.listen(port, () => {
  console.log(`app is listening at http://localhost:${port}`)
});

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0' //without this throw 'Error: self signed certificate in certificate chain'
//With it ' Warning: Setting the NODE_TLS_REJECT_UNAUTHORIZED environment variable to '0' makes TLS 
//connections and HTTPS requests insecure by disabling certificate verification.'