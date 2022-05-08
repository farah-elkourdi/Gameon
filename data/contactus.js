const mongoCollections = require('../config/mongoCollections');
 const validation = require("../task/validation");
 const nodemailer = require('nodemailer');
const hbs = require('nodemailer-handlebars');
const xss = require('xss');
require('dotenv').config();

module.exports = {

// Setup email
async emailSetup( title, description, email) {
  if(arguments.length != 3) throw "emailSetup: pass 3 arguments.";
  if(!title) throw 'emailSetup: supply title';
  if(!description) throw 'emailSetup: supply description';
  if(!email) throw 'emailSetup: supply email';
  try{
    title = validation.checkString(title, 'title');
  description = validation.checkString(description, 'description');
  email = validation.checkString(email, 'email');
  }catch(e){
    throw 'emailSetup: ' + e.toString();
  }
  if(!validation.checkEmail(email)) throw 'emailSetup: badly formatted email.';
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
},
async emailSetuppass( email, code, userName) {
  if(arguments.length != 3) throw "emailSetuppass: pass 3 arguments.";
  if(!email) throw 'emailSetuppass: supply email';
  if(!code) throw 'emailSetuppass: supply code';
  if(!userName) throw 'emailSetuppass: supply userName';
  try{
  code = validation.checkString(code, 'code');
  userName = validation.checkString(userName, 'userName');
  email = validation.checkString(email, 'email');
  }catch(e){
    throw 'emailSetuppass: ' + e.toString();
  }
  if(!validation.checkEmail(email)) throw 'emailSetuppass: badly formatted email.';

  var toemail = email;
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
        defaultLayout: 'temppass' ,
      },
      viewPath: './views/emails',
    })
  );
  const mailOptions = {
    from: process.env.UserEmail,
    to: email,
    subject: "Forget password",
    template: 'temppass',
    context: {
      userName,
      code,
    },
  };
  transporter.sendMail(mailOptions);
},

async emailSetup2( title, action, email) {
  if(arguments.length != 3) throw "emailSetup2: pass 3 arguments.";
  if(!title) throw 'emailSetup2: supply title';
  if(!action) throw 'emailSetup2: supply action';
  if(!email) throw 'emailSetup2: supply email';
  try{
    title = validation.checkString(title, 'title');
  action = validation.checkString(action, 'action');
  email = validation.checkString(email, 'email');
  }catch(e){
    throw 'emailSetup2: ' + e.toString();
  }
  if(!validation.checkEmail(email)) throw 'emailSetup2: badly formatted email.';
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
        defaultLayout: 'notification' ,
      },
      viewPath: './views/emails',
    })
  );
  const mailOptions = {
    from: process.env.UserEmail,
    to: email,
    subject: "Notification",
    template: 'notification',
    context: {
      title,
      email,
      action,
    },
  };
  transporter.sendMail(mailOptions);
},


}