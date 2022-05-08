const express = require('express');
const router = express.Router();
const rateData = require('../data/rate');
const openGeocoder = require('node-open-geocoder')
const validation = require("../task/validation");
const session = require('express-session');
const userData = require('../data/users');
const gameData = require('../data/gameEvent');
const data = require('../data');

router.get('/', async (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    var errors = [];
    if (!validation.validateXSS(req.query.gameId)) {
      errors.push("rate GET: must pass gameid");
      return res.json({
        success: false,
        message: errors
      });
    }
    if (!validation.validateXSS(req.query.user)) {
      errors.push("rate GET: must pass userId");
      return res.json({
        success: false,
        message: errors
      });
    }
    let thisuserid = validation.validateXSS(req.query.user);
    let gameId = validation.validateXSS(req.query.gameId);
    // email = "xpxpfarah@gmail.com"
    // gameId= "626cbbc0c97b343f6c4ac409"
    let userId = req.session.user.userID
    //rating = req.query.rating
    // if(!userId) errors.push( "getUser: must pass userId");
    // if (!validation.checkEmail(email)) errors.push( 'Invalid email.');
    if (!validation.checkId(gameId)) errors.push('rate GET: Invalid gameId.');
    if (!validation.checkId(userId)) errors.push('rate GET: Invalid userId.');
    // if(!rating) errors.push( 'Invalid not an integer.');
    // if(! validation.validinteger(rating)) errors.push( 'Invalid not an integer.');
    if (errors.length != 0)
      return res.json({
        success: false,
        message: errors
      });
    try {
      var game = await gameData.getGameEvent(gameId);
      var user = await userData.getUser(thisuserid);
      var userName = user.firstName + " " + user.lastName;
    } catch {
      errors.push("Error adding rate");
      return res.json({
        success: false,
        message: errors
      });
    }
    res.render("rate/rate", {
      // email: email,
      gameId: gameId,
      name: userName,
      title: game.title,
      userDetails: req.session.user,
      thisuserid: thisuserid

    });
  }
});


router.post('/rateAction', async (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    var errors = [];
    let email = req.session.user.email;
    let gameId = validation.validateXSS(req.body.gameId);
    let rating = validation.validateXSS(req.body.rate);
    let userId = req.session.user.userID
    let organizerId = validation.validateXSS(req.body.userid);

    //rating = req.query.rating
    if (!email) errors.push("/rateAction POST: must pass email");
    if (!gameId) errors.push("/rateAction POST: must pass gameid");
    if (!userId) errors.push("/rateAction POST: must pass userId");
    if (!validation.checkEmail(email)) errors.push('/rateAction POST: Invalid email.');
    if (!validation.checkId(gameId)) errors.push('/rateAction POST: Invalid gameId.');
    if (!validation.checkId(userId)) errors.push('/rateAction POST: Invalid userId.');
    if (!rating) errors.push('/rateAction POST: Missing rating.');
    if (!validation.validinteger(rating)) errors.push('/rateAction POST: Rating not an integer.');
    if (errors.length != 0)
      return res.json({
        success: false,
        message: errors
      });
    try {
      await rateData.rating(email, gameId, userId, rating, organizerId);
    } catch (e) {
      errors.push('Invalid can not add the record in DB.');
      return res.json({
        success: false,
        message: errors
      });
    }
    return res.json({
      success: true,
      message: errors
    });
  }
});



router.get('/ratingpage', async (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    let userId = req.session.user.userID;
    var email = req.session.user.email;

    var gameEvents = [];
    try {
      gameEvents = await data.userEvents.getAllGameEventsRating(userId);
      gameEvents.email = email;
    } catch {
      gameEvents = [];
    }

    res.render('rate/ratingpage', {
      gameEventsList: gameEvents,
      userDetails: req.session.user
    });

  }
});



module.exports = router;