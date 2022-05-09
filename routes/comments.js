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

router.route('/')
    .post(async (req, res) => {
        //check if the user is signed in...
        if (!req.session.user) {
            return res.redirect('/');
        }

        //get current user id
        let body = check.validateObjectXSS(req.body);
        let gameEventId, userId, comment, timestamp;
        /* input checking */
        try {
            if (Object.keys(body).length != 2) {
                throw "post /comments: pass gameEventId & comment in req body."
            };
            if (!check.validateXSS(body.gameEventId)) throw 'supply gameEventId';
            if (!check.validateXSS(body.comment)) throw 'supply comment';
            gameEventId = check.checkId(check.validateXSS(body.gameEventId));
            userId = req.session.user.userID;
            comment = check.checkString(check.validateXSS(body.comment));
            timestamp = new Date();
        } catch (e) {
            return res.json({
                success: false,
                error: e.toString()
            });
        }
        //check user is a participant in the event
        let joined;
        try {
            joined = await userEvents.checkParticipation(userId, gameEventId);
        } catch (e) {
            return res.json({
                success: false,
                error: e.toString()
            });
        }
        if (!joined.participant) {
            return res.json({
                success: false,
                error: 'you must be registered for this event to post a comment'
            });
        }

        let posted;
        try {
            let email = req.session.user.email;
            posted = await comments.postComment(userId, gameEventId, comment, timestamp, email);
        } catch (e) {
            return res.json({
                success: false,
                error: e.toString()
            });
        }
        if (!posted) {
            return res.json({
                success: false,
                error: 'error posting comment'
            });
        }
        return res.json({
            success: true,
            error: ''
        });
    });
router.route('/:gameEventId')
    .get(async (req, res) => {
        //check if the user is signed in...
        if (!req.session.user) {
            return res.redirect('/');
        }
        let userId = req.session.user.userID;
        //get current user id
        let params = check.validateObjectXSS(req.params);
        let gameEventId
        /* input checking */
        try {
            if (Object.keys(params).length != 1) {
                throw "get /comments: only pass gameEventId in req body."
            };
            if (!check.validateXSS(params.gameEventId)) throw 'supply gameEventId';
            gameEventId = check.checkId(check.validateXSS(params.gameEventId));

        } catch (e) {
            return res.status(400).send(e.toString());
        }

        //check user is a participant in the event
        let joined;
        try {
            joined = await userEvents.checkParticipation(userId, gameEventId);
        } catch (e) {
            return res.status(400).send(e.toString());
        }
        if (!joined.participant) {
            return res.status(403).send("You must be registered for this event to view comments.");
        }

        let eventComments;
        try {
            eventComments = await comments.getCommentsForEvent(gameEventId);
        } catch (e) {
            return res.status(400).send(e.toString());
        }

        return res.render('commentList', {
            comments: eventComments,
            layout: false
        });
    });

module.exports = router;