const express = require('express');
const session = require('express-session');
const router = express.Router();
const data = require('../data');
const gameEvent = data.gameEvent;
const comments = data.comments;
const users = data.users;
const userEvents = data.userEvents;
const {
    ObjectId
} = require('mongodb');
const check = require('../task/validation');
/* view the page for an event */
router.route('/:id')
    .get(async (req, res) => {

        //check if the user is signed in...
        if (!req.session.user) {
            return res.redirect('/');
        }

        //get current user id
        let currentUserId = req.session.user.userID;
        if(!currentUserId){
            return res.status(500).render('errors/error', {
                error: 'No user id in session'
            });
        }
        if(!req.params.id){
            return res.status(400).render('errors/error', {
                error: 'No game event id url parameters.'
            });
        } 
        //check id
        let ID;
        try {
            ID = check.checkId(check.validateXSS(req.params.id));
        } catch (e) {
            return res.status(400).render('errors/error', {
                error: e.toString()
            });
        }

        //get event from id
        let event;
        try {
            event = await gameEvent.getGameEvent(ID);
        } catch (e) {
            return res.status(404).render('errors/error', {
                error: e.toString()
            });
        }
        //check the user's area and the event area align
        if (event.area != req.session.user.userArea) {
            return res.redirect(303, '/');
        }

        //check if current user is already registered for the event
        let joined = false;
        if (event.participants.map(x => x.toString()).includes(currentUserId)) {
            joined = true;
        }

        //Convert event datetime format for UI
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        let startTime = new Date(event.startTime);
        let endTime = new Date(event.endTime);
        event.startTime = startTime.toLocaleDateString("en-US", options);
        event.endTime = endTime.toLocaleDateString("en-US", options);


        //gets the organizer object from the userId in event & stores their name.
        const organizer = await users.getUser(event.userId);
        event.organizerName = organizer.firstName + ' ' + organizer.lastName;
        //takes the list of user ids from event.participants and stores their names.
        for (let i = 0; i < event.participants.length; i++) {
            const participant = await users.getUser(event.participants[i].toString());
            let name = participant.firstName + ' ' + participant.lastName;
            let pObject = {
                id: event.participants[i].toString(),
                name: name,
                email: participant.email
            };
            event.participants[i] = pObject;
        }
        //queries comment collection for all comments associated with this event id
        let commentsArray = [];
        try {
            commentsArray = await comments.getCommentsForEvent(ID);
        } catch (e) {
            return res.status(404).render('errors/error', {
                error: e.toString()
            });
        }

        //Update comments
        for (let i = 0; i < commentsArray.length; i++) {
            let comment = commentsArray[i];
            let timestamp = new Date(comment.timestamp);
            commentsArray[i].timestamp = timestamp.toLocaleDateString("en-US", options);
        }


        return res.render('viewGameEvent', {
            title: event.title,
            event: event,
            comments: commentsArray,
            currentUserId: currentUserId,
            joined: joined,
            userDetails: req.session.user
        });
    });

router.route('/:id')
    .post(async (req, res) => {
            /* user registering for an event */

            //check if the user is signed in...
         //   console.log(JSON.stringify(req.session.user));
            if (!req.session.user) {
                return res.redirect(303, '/'); //using code 303 to specify a get request
            }

            //get current user id
            let currentUserId = req.session.user.userID;
            if(!currentUserId){
                return res.status(500).render('errors/error', {
                    error: 'No user id in session'
                });
            }
            if(!req.params.id){
                return res.status(400).render('errors/error', {
                    error: 'No game event id url parameters.'
                });
            } 
            //check id
            let ID;
            try {
                ID = check.checkId(check.validateXSS(req.params.id));
            } catch (e) {
                return res.json({success: false, message: e});
            }
            //get event
            let event;
            try {
                event = await gameEvent.getGameEvent(ID);
            } catch (e) {
                return res.json({success: false, message: e});
            }
            //check the user's area and the event area align
            if (event.area != req.session.user.userArea) {
                return res.redirect(303, '/');
            }

            //check for existing events that conflict with this event

            let conflict;
            try{
                conflict = await users.checkUserConflict(currentUserId, event.startTime, event.endTime);
            }
            catch(e){
                return res.json({success: false, message: e});
            }

            if(conflict.conflicted){
                return res.json({success: false, message: 'You are already registered for an event during this time.'});
            }

            let inserted;
            try {
                inserted = await userEvents.insert(currentUserId, ID);
            } catch (e) {
                return res.json({success: false, message: e});
            }
            if (!inserted.userInserted) {
                return res.json({success: false, message: "An unknown error occured during registration. Please try again."});
            }

            return res.json({success: true, message: "Success"});
        });

router.route('/leave/:eventId')
    .post(async (req, res) => {
        //check if the user is signed in...
        if (!req.session.user) {
            return res.redirect(303, '/'); //using code 303 to specify a get request
        }

        //get current user id
        let currentUserId = req.session.user.userID;
        if(!currentUserId){
            return res.status(500).render('errors/error', {
                error: 'No user id in session'
            });
        }
        if(!req.params.eventId){
            return res.status(400).render('errors/error', {
                error: 'No game event id url parameters.'
            });
        } 
        //check id
        let ID;
        try {
            ID = check.checkId(check.validateXSS(req.params.eventId));
        } catch (e) {
            return res.json({success: false, message: e});
        }

        //get event
        let event;
        try {
            event = await gameEvent.getGameEvent(ID);
        } catch (e) {
            return res.json({success: false, message: e});
        }
        //check the user's area and the event area align
        if (event.area != req.session.user.userArea) {
            return res.redirect(303, '/');
        }

        let removed;
        try {
            removed = await userEvents.remove(currentUserId, ID);
        } catch (e) {
            return res.json({success: false, message: e});
        }
        if (!removed.userRemoved) {
            return res.json({success: false, message: "An unknown error occured during deregistration. Please try again."});
        }

        return res.json({success: true, message: "Success"});
    });

module.exports = router;