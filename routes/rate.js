const express = require('express');
const router = express.Router();
const rateData = require('../data/rate');
const openGeocoder = require('node-open-geocoder')
const validation = require("../task/validation");
const session = require('express-session');
const userData = require('../data/users');
const gameData = require('../data/gameEvent');

router.get('/', async (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    var errors = [];
    let email = req.query.email;
    let gameId = req.query.gameId;
    email = "xpxpfarah@gmail.com"
    gameId= "626cbbc0c97b343f6c4ac409"
    userId= req.session.user.userID
    //rating = req.query.rating
    if(!email) errors.push( "getUser: must pass email");
    if(!gameId) errors.push( "getUser: must pass gameid");
    if(!userId) errors.push( "getUser: must pass userId");
    if (!validation.checkEmail(email)) errors.push( 'Invalid email.');
    if (!validation.checkId(gameId)) errors.push( 'Invalid gameId.');
    if (!validation.checkId(userId)) errors.push( 'Invalid userId.');
   // if(!rating) errors.push( 'Invalid not an integer.');
   // if(! validation.validinteger(rating)) errors.push( 'Invalid not an integer.');
if(errors.length != 0)
return res.json({success: false, message: errors});
try
{
var game = await gameData.getGameEvent(gameId);
    var user = await userData.getUserByEmail(email);
    var userName = user.firstName + " " + user.lastName;
}
catch
{
  errors.push( "Error adding rate");
  return res.json({success: false, message: errors});
}
    res.render("rate/rate", {
      email: email,
      gameId: gameId,
      name: userName,
      title: game.title

  });
  }
});


router.post('/rateAction', async (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    var errors = [];
    let email = req.body.email;
    let gameId = req.body.gameId;
    let rating = req.body.rate;
   let  userId= req.session.user.userID
    //rating = req.query.rating
    if(!email) errors.push( "getUser: must pass email");
    if(!gameId) errors.push( "getUser: must pass gameid");
    if(!userId) errors.push( "getUser: must pass userId");
    if (!validation.checkEmail(email)) errors.push( 'Invalid email.');
    if (!validation.checkId(gameId)) errors.push( 'Invalid gameId.');
    if (!validation.checkId(userId)) errors.push( 'Invalid userId.');
    if(!rating) errors.push( 'Invalid not an integer.');
    if(! validation.validinteger(rating)) errors.push( 'Invalid not an integer.');
if(errors.length != 0)
return res.json({success: false, message: errors});
try
{
    await rateData.rating(email,gameId,userId, rating );
}
catch (e)
{
  errors.push( 'Invalid can not add the record in DB.');
  return res.json({success: false, message: errors});
}
    return res.json({success: true, message: errors});
  }
});
module.exports = router;





