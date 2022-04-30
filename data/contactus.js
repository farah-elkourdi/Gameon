const mongoCollections = require('../config/mongoCollections');
 const validation = require("../task/validation");
 const nodemailer = require('nodemailer');
const hbs = require('nodemailer-handlebars');
require('dotenv').config();

module.exports = {

// Setup email
async emailSetup( title, description, email) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.UserEmail,
      pass: process.env.UserPassword,
    },
  });
  transporter.use(
    'compile',
    hbs({
      viewEngine: {
        extname: '.handlebars',
        layoutsDir: './views/emails',
        defaultLayout: 'contactus' ,
      },
      viewPath: './views/emails',
    })
  );
  const mailOptions = {
    from: process.env.UserEmail,
    to: process.env.UserEmail,
    subject: "Contact us",
    template: 'contactus',
    context: {
      title,
      email,
      description,
    },
  };
  transporter.sendMail(mailOptions);
}




}