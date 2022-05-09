const express = require('express');
const router = express.Router();
const validation = require("../task/validation");
const contactUs = require('../data/contactus');

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
  const title = validation.validateXSS(req.body.msgtitle);
  const description = validation.validateXSS(req.body.description);
  const email = validation.validateXSS(req.body.email);

  var errors = [];
  if(!title){
    errors.push('contactus/Checksignup POST: missing message title.');
    return res.json({success: true, message: errors});
  }
  if(!description){
    errors.push('contactus/Checksignup POST: missing description.');
    return res.json({success: true, message: errors});
  }
  if(!email){
    errors.push('contactus/Checksignup POST: missing email.');
    return res.json({success: true, message: errors});
  }
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