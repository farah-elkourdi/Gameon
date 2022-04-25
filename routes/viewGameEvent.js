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
/* view the page for an event */
router.route('/:id')
.get(async (req, res) => {
    
    //check if the user is signed in...
    if(!req.session.user){
        return res.redirect('/');
    }
    
    //get current user id
    let currentUserId = req.session.user.userID;
    //check id
    let ID;
    try{
        ID = check.checkId(req.params.id);
    }catch(e){
        return res.status(400).render('errors/error', {error: e.toString()});
    }
    
    //get event from id
    let event;
    try{
        event = await gameEvent.getGameEvent(ID);
    }catch(e){
        return res.status(404).render('errors/error', {error: e.toString()});
    }
    //check if current user is already registered for the event
    let joined = false;
    if(event.participants.map(x =>x.toString()).includes(currentUserId)){
        joined = true;
    }
    console.log(currentUserId);
    console.log(event.participants.map(x =>x.toString()));
    //gets the organizer object from the userId in event & stores their name.
    const organizer = await users.getUser(event.userId);
    event.organizerName = organizer.firstName + ' ' + organizer.lastName;
    //takes the list of user ids from event.participants and stores their names.
    for(let i =0; i<event.participants.length; i++){
        const participant = await users.getUser(event.participants[i].toString());
        let name = participant.firstName + ' ' + participant.lastName;
        let pObject = {
            id: event.participants[i].toString(),
            name: name,
        };
        event.participants[i] = pObject;
    }
    //queries comment collection for all comments associated with this event id
    let commentsArray;
    try{
        commentsArray = await comments.getCommentsForEvent(ID);
    }catch(e){
        return res.status(404).render('errors/error', {error: e.toString()});
    }
    return res.render('viewGameEvent', {title: event.title, event: event, comments: commentsArray, currentUserId: currentUserId, joined: joined});
})
.post(async (req,res) => {
    //check if the user is signed in...
    if(!req.session.user){
        return res.redirect(303, '/'); //using code 303 to specify a get request
    }
    
    //get current user id
    let currentUserId = req.session.user.userID;
    //check id
    let ID;
    try{
        ID = check.checkId(req.params.id);
    }catch(e){
        return res.status(400).render('errors/error', {error: e.toString()});
    }
    let inserted;
    try{
        inserted = await userEvents.insert(currentUserId, ID);
    }
    catch(e){
        return res.status('errors/error', {error: e.toString()});
    }
    if(!inserted.userInserted) return res.status(400).render('errors/error', {error: "An unknown error occured during registration. Please try again."});

    return res.redirect(303, '/viewGameEvent/'+ID);
});

router.route('/:id/leave')
.post(async (req,res) => {
    //check if the user is signed in...
    if(!req.session.user){
        return res.redirect(303, '/'); //using code 303 to specify a get request
    }
    
    //get current user id
    let currentUserId = req.session.user.userID;
    //check id
    let ID;
    try{
        ID = check.checkId(req.params.id);
    }catch(e){
        return res.status(400).render('errors/error', {error: e.toString()});
    }
    let removed;
    try{
        removed = await userEvents.remove(currentUserId, ID);
    }
    catch(e){
        return res.status('errors/error', {error: e.toString()});
    }
    if(!removed.userRemoved) return res.status(400).render('errors/error', {error: "An unknown error occured during deregistration. Please try again."});

    return res.redirect(303, '/viewGameEvent/'+ID);
})
module.exports = router;