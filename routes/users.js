const express = require('express');
const router = express.Router();
const usersData = require('../data/users');
const openGeocoder = require('node-open-geocoder')
const validation = require("../task/validation");
const session = require('express-session');

router.get('/profile', async (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    res.render("user/profile", {
      title: "Profile",
      userDetails: req.session.user,
      firstName: req.session.user.userFirstName,
      lastName: req.session.user.userLastName,
      email: req.session.user.email,
      street: req.session.user.userStreet,
      area: req.session.user.userArea,
      lat: req.session.user.lat,
      lon: req.session.user.lon,
      avgRating: req.session.user.avgRating
    });
  }
});


router.get('/publicprofile', async (req, res) => {
  let topuser = false;
  /* checking for existence of inputs */
  if(!validation.validateObjectXSS(req.query)){
    return res.status(400).render('errors/error', {
      error: 'Missing request query.'
  });
  }
  if(!validation.validateXSS(req.query.email)){
    return res.status(400).render('errors/error', {
      error: 'No user email in query'
  });
  }
  const email = validation.validateXSS(req.query.email);
  if (!req.session.user) {
    res.redirect("/");
  } else {
    let user = await usersData.getUserByEmail(email)
    const userRate = require('../data/rate');
    let users = await userRate.getTopRatings();
    users.forEach( (user) => {
      if (user.email == email)
      {
        topuser = true;
      }
    });
    res.render("user/publicprofile", {
      topuser: topuser,
      firstName: user.firstName ,
      lastName: user.lastName,
      email: user.email,
      street: user.street,
      area: user.area,
      lat: user.lat,
      lon: user.lon,
      userDetails: req.session.user,
      avgRating: req.session.user.avgRating
  });
  }
});

router.get('/signup', async (req, res) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("user/signup", {
      partial: 'map_signup'
    });
  }
});

router.post("/map", async (req, response) => {
  // if(!req.body.street){
  //   return res.status(400).render('errors/error', {
  //     error: 'Missing street in request body.'
  // });
  // }
  // if(!req.body.area){
  //   return res.status(400).render('errors/error', {
  //     error: 'Missing area in request body.'
  // });
  // }
  var street = validation.validateXSS(req.body.street);
  var area = validation.validateXSS(req.body.area);
  var lat;
  var lon;
  var status;
  openGeocoder()
    .geocode(street + ', ' + area)
    //.geocode('106 duncan ave, new jersey')
    .end((err, res) => {
      var data = res;
      if (!data)
        status = false;
      else if (data.length === 0)
        status = false;
      else {
        lat = data[0].lat
        lon = data[0].lon
      }
      if (status == false) {
        return response.json({
          success: true,
          message: "Error"
        });
      }
      return response.json({
        success: true,
        message: {
          lat: lat,
          lon: lon
        }
      });
    })
});

router.post('/Checksignup', async (req, res) => {
  var errors = [];
  /* check for existence of inputs */
  if(!validation.validateObjectXSS(req.body)){
    errors.push('Missing request body.');
    return res.json({
      success: true,
      message: errors
    });
  }
  if(!validation.validateXSS(req.body.firstName)){
    errors.push('Missing first name.');
    return res.json({
      success: true,
      message: errors
    });
  }
  if(!validation.validateXSS(req.body.lastName)){
    errors.push('Missing last name.');
    return res.json({
      success: true,
      message: errors
    });
  }
  if(!validation.validateXSS(req.body.password)){
    errors.push('Missing password.');
    return res.json({
      success: true,
      message: errors
    });
  }
  if(!validation.validateXSS(req.body.email)){
    errors.push('Missing email.');
    return res.json({
      success: true,
      message: errors
    });
  }
  if(!validation.validateXSS(req.body.area)){
    errors.push('Missing area.');
    return res.json({
      success: true,
      message: errors
    });
  }
  if(!validation.validateXSS(req.body.street)){
    errors.push('Missing street.');
    return res.json({
      success: true,
      message: errors
    });
  }
  if(!validation.validateXSS(req.body.lat)){
    errors.push('Missing latitude.');
    return res.json({
      success: true,
      message: errors
    });
  }
  if(!validation.validateXSS(req.body.lon)){
    errors.push('Missing longitude.');
    return res.json({
      success: true,
      message: errors
    });
  }
  const firstName = validation.validateXSS(req.body.firstName);
  const lastName = validation.validateXSS(req.body.lastName);
  const password = validation.validateXSS(req.body.password);
  const email = validation.validateXSS(req.body.email);
  const area = validation.validateXSS(req.body.area);
  const street = validation.validateXSS(req.body.street);
  const lat = validation.validateXSS(req.body.lat);
  const lon = validation.validateXSS(req.body.lon);

  if (!validation.validString(firstName, "firstName")) errors.push('Invalid first name.');
  if (!validation.validString(lastName, "lastName")) errors.push('Invalid last name.');
  if (!validation.validString(password)) errors.push('Invalid password.');
  if (!validation.validString(area) || !validation.checkValidationDlArea(area)) errors.push('Invalid area.');
  if (!validation.checkEmail(email)) errors.push('Invalid email.');
  if (!validation.checkCoordinates(lon, lat) || !validation.validString(street)) errors.push('Invalid address');
  if (errors.length == 0) {
    try {
      await usersData.createUser(firstName, lastName, email, password, street, area, lat, lon);
    } catch (e) {
      errors.push('Error this email exists.');
      return res.json({
        success: true,
        message: errors
      });
    }
    return res.json({
      success: true,
      message: errors
    });
  } else
    return res.json({
      success: true,
      message: errors
    });
});

router.get('/login', async (req, res) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("user/login");
  }
});

router.post('/Checksignin', async (req, res) => {
  var errors = [];
  /* checking for existence of inputs */
  if(!req.body){
    errors.push('Missing request body.');
    return res.json({
      success: true,
      message: errors
    });
  }
  if(!req.body.email){
    errors.push('Missing email in request body.');
    return res.json({
      success: true,
      message: errors
    });
  }
  if(!req.body.password){
    errors.push('Missing password in request body.');
    return res.json({
      success: true,
      message: errors
    });
  }
  const email = validation.validateXSS(req.body.email);
  const password = validation.validateXSS(req.body.password);
  
  if (!validation.validString(password)) errors.push('Invalid password or email.');
  if (!validation.checkEmail(email)) errors.push('Invalid password or email.');
  if (errors.length == 0) {
    try {
      let users = await usersData.checkUser(email, password);
      let user = users.user;
      if (users.authenticated == true) {
        req.session.user = {
          userID: user._id,
          userFirstName: user.firstName,
          userLastName: user.lastName,
          email: user.email,
          userArea: user.area,
          userStreet: user.street,
          lat: users.user.lat,
          lon: users.user.lon,
          avgRating: users.user.avgRating
        };
      }
    } catch (e) {
      errors.push('Invalid password or email.');
      return res.json({
        success: true,
        message: errors
      });
    }
    return res.json({
      success: true,
      message: errors
    });
  } else
    return res.json({
      success: true,
      message: errors
    });
});

router.get('/logout', async (req, res) => {
  if (req.session.user) {
    req.session.destroy();
    res.clearCookie("AuthCookie");

    res.redirect("/");
    // res.render("user/logout", { title: "Logout" });
  } else {
    //res.render("user/login", { title: "Login" });
    res.redirect("/");
  }
});


router.post('/Checkprofile', async (req, res) => {
  var errors = [];
  /* checking for existence of inputs */
  if(!req.body){
    errors.push('Missing request body.');
    return res.json({
      success: true,
      message: errors
    });
  }
  if(!req.body.firstName){
    errors.push('Missing first name.');
    return res.json({
      success: true,
      message: errors
    });
  }
  if(!req.body.lastName){
    errors.push('Missing last name.');
    return res.json({
      success: true,
      message: errors
    });
  }
  const firstName = validation.validateXSS(req.body.firstName);
  const lastName = validation.validateXSS(req.body.lastName);
  // const password = req.body.password;
  // const email = req.body.email;
  // const area = req.body.area;
  //const street = req.body.street;
  // const lat =  req.body.lat;
  //const lon =  req.body.lon;


  if (!validation.validString(firstName, "firstName")) errors.push('Invalid first name.');
  if (!validation.validString(lastName, "lastName")) errors.push('Invalid last name.');
  // if (!validation.validString(password)) errors.push('Invalid password.');
  //if (!validation.validString(area) || !validation.checkValidationDlArea(area) ) errors.push('Invalid area.');
  // if (!validation.checkEmail(email)) errors.push('Invalid email.');
  // if (!validation.checkCoordinates(lon,lat) || !validation.validString(street)) errors.push('Invalid address');
  if (errors.length == 0) {
    try {
      await usersData.updateUser(firstName, lastName, req.session.user.email, req.session.user.userID);

      //await usersData.updateUser(firstName,lastName,req.session.user.email,  street, area, lat, lon, req.session.user.userID); 
      // req.session.user.userStreet = street;
      // req.session.user.lat = lat
      // req.session.user.lon = lon
      // req.session.user.userArea = area
      req.session.user.userFirstName = firstName
      req.session.user.userLastName = lastName
    } catch (e) {
      errors.push('Error no new update.');
      return res.json({
        success: true,
        message: errors
      });
    }
    return res.json({
      success: true,
      message: errors
    });
  } else
    return res.json({
      success: true,
      message: errors
    });
});

router.get('/userprofile', async (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
  } else {
let topuser = false;
    const userRate = require('../data/rate');
    let users = await userRate.getTopRatings();
    users.forEach( (user) => {
      if (user._id == req.session.user.userID)
      {
        topuser = true;
  }});

    res.render("user/userprofile", {
      title: "Profile",
      userDetails: req.session.user,
      firstName: req.session.user.userFirstName,
      lastName: req.session.user.userLastName,
      email: req.session.user.email,
      street: req.session.user.userStreet,
      area: req.session.user.userArea,
      lat: req.session.user.lat,
      avgRating: req.session.user.avgRating,
      lon: req.session.user.lon, 
      topuser: topuser
  });
  }
});

router.get('/changepass', async (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    res.render("user/changepass", {
      title: "Change password",
      userDetails: req.session.user
    });
  }
});

router.post('/Checkpass', async (req, res) => {
  var errors = [];
  if(!req.body){
    errors.push('Missing request body.');
    return res.json({
      success: true,
      message: errors
    });
  }
  if(!req.body.password){
    errors.push('Missing password in request body.');
    return res.json({
      success: true,
      message: errors
    });
  }
  const password = validation.validateXSS(req.body.password);
  if (!validation.validString(password)) errors.push('Invalid password.');
  if (errors.length == 0) {
    try {
      await usersData.updatePass(password, req.session.user.email);
    } catch (e) {
      errors.push('Error can not update password.');
      return res.json({
        success: true,
        message: errors
      });
    }
    return res.json({
      success: true,
      message: errors
    });
  } else
    return res.json({
      success: true,
      message: errors
    });
});


router.get('/forgetpass', async (req, res) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("user/forgetpass", {
      title: "Forget password"
    });
  }
});

router.post('/temppass', async (req, res) => {
  var errors = [];
  if(!req.body.email){
    errors.push('Missing email.');
    return res.json({
      success: true,
      message: errors
    });
  }
  const email = validation.validateXSS(req.body.email);
  if (!validation.checkEmail(email)) errors.push('Invalid email.');
  if (errors.length == 0) {
    try {
      await usersData.forgetPass(email);
    } catch (e) {
      errors.push('Error email does not exist.');
      return res.json({
        success: true,
        message: errors
      });
    }
    return res.json({
      success: true,
      message: errors
    });
  } else
    return res.json({
      success: true,
      message: errors
    });
});

// router.post('/clickname/:email', async(req, res) => {
//   const email = req.params.email;


//   res.redirect("user/publicprofile", {
//       email: email
//   });

// });

module.exports = router;