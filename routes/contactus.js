const express = require('express');
const router = express.Router();
const validation = require("../task/validation");
const contactUs = require('../data/contactus');
const xss = require('xss');

router.get('/' ,async (req,res) => {
  if (!req.session.user) {
    res.render('contactus/contactus', {
      title: "Contact us"
  });
}
else
{
  res.render('contactus/contactus', {
    title: "Contact us",
    userDetails: req.session.user
});
}
});

router.post('/Checksignup', async(req, res) => {
  const title = xss(req.body.msgtitle);
  const description = xss(req.body.description);
  const email = xss(req.body.email);

  var errors = [];
  if (!validation.validString(title, "title")) errors.push('Invalid title.');
  if (!validation.validString(description, "description")) errors.push('Invalid description.');
  if (!validation.checkEmail(email)) errors.push('Invalid email.');


  if(errors.length == 0 )
  {
  try
  {
    await contactUs.emailSetup(title, description,email); 
  }
  catch(e)
  {
    errors.push('Can not send your response.');
  return res.json({success: true, message: errors});
}
  return res.json({success: true, message: errors});
}
else
return res.json({success: true, message: errors});
});


module.exports = router;