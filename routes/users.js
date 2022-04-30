const express = require('express');
const router = express.Router();
const usersData = require('../data/users');
const openGeocoder = require('node-open-geocoder')
const validation = require("../task/validation");
const session = require('express-session');

router.get('/signup', async (req, res) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("user/signup", { partial : 'map_signup' });;
  }
});

router.post("/map", async (req, response) => {
  var street = req.body.street;
  var area = req.body.area;
  var lat;
  var lon;
  var status;
  openGeocoder()
  .geocode( street +', '+ area)
  //.geocode('106 duncan ave, new jersey')
  .end((err, res) => {var data = res; 
    if (!data)
    status = false;
    else if (data.length === 0)
    status = false;
    else
    {
    lat = data[0].lat
    lon = data[0].lon
    }
    if (status == false)
    { return response.json({success: true, message: "Error"});}
    return response.json({success: true, message: {lat: lat, lon: lon}});
  })
});

router.post('/Checksignup', async(req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const email = req.body.email;
  const area = req.body.area;
  const street = req.body.street;
  const lat =  req.body.lat;
  const lon =  req.body.lon;

  var errors = [];
  if (!validation.validString(firstName, "firstName")) errors.push('Invalid first name.');
  if (!validation.validString(lastName, "lastName")) errors.push('Invalid last name.');
  if (!validation.validString(password)) errors.push('Invalid password.');
  if (!validation.validString(area)) errors.push('Invalid area.');
  if (!validation.checkEmail(email)) errors.push('Invalid email.');
  if (!validation.checkCoordinates(lon,lat) || !validation.validString(street)) errors.push('Invalid address');
  if(errors.length == 0 )
  {
  try
  {
    await usersData.createUser(firstName,lastName,email, password, street, area, lat, lon); 
  }
  catch(e)
  {
    errors.push('Error this email exists.');
  return res.json({success: true, message: errors});
}
  return res.json({success: true, message: errors});
}
else
return res.json({success: true, message: errors});
});

router.get('/login', async (req, res) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("user/login");
  }
});

router.post('/Checksignin', async(req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  var errors = [];
  if (!validation.validString(password)) errors.push('Invalid password or email.');
  if (!validation.checkEmail(email)) errors.push('Invalid password or email.');
  if(errors.length == 0 )
  {
  try
  {
    let users = await usersData.checkUser(email, password);
    let user = users.user;
    if (users.authenticated == true) {
      req.session.user = {
      userID : user._id,
      userFirstName : user.firstName,
      userLastName : user.lastName,
      email : user.email,
      userArea : user.area,
      userStreet : user.street
      };
    } 
  }
  catch(e)
  {
    errors.push('Invalid password or email.');
  return res.json({success: true, message: errors});
}
  return res.json({success: true, message: errors});
}
else
return res.json({success: true, message: errors});
});

router.get('/logout', async (req, res) => {
  if (req.session.user) {
  req.session.destroy();
  res.clearCookie("AuthCookie");
  
  res.redirect("/");
  // res.render("user/logout", { title: "Logout" });
  }
  else {
    //res.render("user/login", { title: "Login" });
    res.redirect("/");
  }
});

module.exports = router;