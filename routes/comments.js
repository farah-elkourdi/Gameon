const express = require('express');
const session = require('express-session');
const router = express.Router();
const data = require('../data');
const gameEvent = data.gameEvent;
const comments = data.comments;
const users = data.users;
const userEvents = data.userEvents;
const { ObjectId } = require('mongodb');
const check = require('../task/validation');

router.route('/')
.post(async (req, res) => {
    //check if the user is signed in...
    if(!req.session.user){
        return res.redirect('/');
    }
    
    //get current user id
    let body = req.body;
    let gameEventId, userId, comment, timestamp;
    /* input checking */
    try{
        if(Object.keys(body).length != 2){ throw "post /comments: pass gameEventId & comment in req body."};
    if(!body.gameEventId) throw 'supply gameEventId';
    if(!body.comment) throw 'supply comment';
    gameEventId = check.checkId(body.gameEventId);
    userId =  req.session.user.userID;
    comment = check.checkString(body.comment);
    timestamp = Date.now();
    }catch(e){
        return res.json({success : false, error : e.toString()});
    }

     //check user is a participant in the event
     let joined;
     try{
         joined = await userEvents.checkParticipation(userId, gameEventId);
     }
     catch(e){
        return res.status(404).render('errors/error', {error: e.toString()});
     }
    if(!joined.participant){
        return res.status(404).render('errors/error', {error: "You must be registered for this event to post a comment."});
    }

    let posted;
    try{
        posted = await comments.postComment(userId, gameEventId, comment, timestamp);
    }
    catch(e){
        return res.json({success : false, error : e.toString()});
    }
    if(!posted){
        return res.json({success : false, error : 'error posting comment'});
    }
    return res.json({success : true, error : ''});
});