const express = require('express');
const router = express.Router();
const data = require('../data');
const gameEvent = data.gameEvent;
const comments = data.comments;
const users = data.users;
const check = require('../task/validation');

router.get('/:id', async (req, res) => {
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
    //gets the organizer object from the userId in event & stores their name.
    const organizer = await users.getUser(event.userId);
    event.organizerName = organizer.firstName + ' ' + organizer.lastName;
    //takes the list of user ids from event.participants and stores their names.
    for(let i =0; i<event.participants.length; i++){
        const participant = await users.getUser(event.participants[i]);
        let name = participant.firstName + ' ' + participant.lastName;
        let pObject = {
            id: event.participants[i],
            name: name,
        };
        event.participants[i] = pObject;
    }
    //queries comment collection for all comments associated with this event id
    //queries the user collection using the poster id from the comment - adds the poster's name to the comment object.
    let commentsArray;
    try{
        commentsArray = await comments.getCommentsForEvent(ID);
    }catch(e){
        return res.status('errors/error', {error: e.toString()});
    }
    for(let i =0; i<commentsArray.length; i++){
        const poster = await users.getUser(commentsArray[i].userId);
        commentsArray[i].firstName = poster.firstName;
        commentsArray[i].lastName = poster.lastName;
    }
    
    res.render('viewGameEvent', {title: event.title, event: event, comments: commentsArray});
});