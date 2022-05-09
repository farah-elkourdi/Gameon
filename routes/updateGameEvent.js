const express = require('express');
const router = express.Router();
const data = require('../data');
const check = require('../task/validation');
const gameEvent = require('../data/gameEvent');
const moment = require('moment');
const {
    deserialize
} = require('bson');
const {
    description
} = require('../public/js/geocode');

const usersData = require('../data/users');
const contactUs = require('../data/contactus');
// Global variable updateGameEventData
var updateGameEventData;

router.get('/:id', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    if (!check.validateObjectXSS(req.params)) {
        return res.status(400).render('errors/error', {
            error: 'updateGameEvent/:id GET: Missing request parameters'
        });
    }
    if (!check.validateXSS(req.params.id)) {
        return res.status(400).render('errors/error', {
            error: 'updateGameEvent/:id GET: No id in parameters'
        });
    }
    let id = check.validateXSS(req.params.id);
    try {
        id = check.checkId(id);
    } catch (e) {
        return res.status(400).render('errors/error', {
            error: e.toString()
        });
    }
    let event;
    try {
        event = await gameEvent.getGameEvent(id);
    } catch (e) {
        return res.status(400).render('errors/error', {
            error: e.toString()
        });
    }
    res.render('updateGameEvent/updateGameEvent-Init', {
        userDetails: req.session.user,
        area: req.session.user.userArea,
        gameEventId: check.validateXSS(req.params.id),
        event: event
    });
});

router.post('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    updateGameEventData = check.validateObjectXSS(req.body);
    let userId = req.session.user.userID;
    try {
        if (!userId) throw 'updateGameEvent: no user id';
        if (!updateGameEventData) throw 'updateGameEvent: Missing request body';
        userId = check.checkId(userId);
        updateGameEventData.gameEventId = check.validateXSS(updateGameEventData.gameEventId);
        if (!updateGameEventData.gameEventId) throw 'updateGameEvent: Missing gameEventId';
        updateGameEventData.gameEventId = check.checkId(updateGameEventData.gameEventId, 'gameEventId');
        updateGameEventData.title = check.validateXSS(updateGameEventData.title);
        if (!updateGameEventData.title) throw 'updateGameEvent: Missing title';
        updateGameEventData.title = check.checkString(updateGameEventData.title, 'title');
        updateGameEventData.status = "upcoming";
        updateGameEventData.sportCategory = check.validateXSS(updateGameEventData.sportCategory);
        if (!updateGameEventData.sportCategory) throw 'updateGameEvent: Missing sportCategory';
        updateGameEventData.sportCategory = check.checkString(updateGameEventData.sportCategory, 'sportCategory');
        updateGameEventData.description = check.validateXSS(updateGameEventData.description);
        if (!updateGameEventData.description) throw 'updateGameEvent: Missing description';
        updateGameEventData.description = check.checkString(updateGameEventData.description, 'description');
        //     updateGameEventData.address = check.validateXSS(updateGameEventData.address);
        //     if(!updateGameEventData.address) throw 'updateGameEvent: Missing address';
        //     updateGameEventData.address = check.checkString(updateGameEventData.address, 'address');  

        //    // updateGameEventData.area = check.checkString(updateGameEventData.area, 'area');
        //    updateGameEventData.latitude = check.validateXSS(updateGameEventData.latitude);
        //    if(!updateGameEventData.latitude) throw 'updateGameEvent: Missing latitude';
        //     updateGameEventData.latitude = updateGameEventData.latitude;
        //     updateGameEventData.longitude = check.validateXSS(updateGameEventData.longitude);
        //     if(!updateGameEventData.longitude) throw 'updateGameEvent: Missing longitude';
        //     updateGameEventData.longitude = updateGameEventData.longitude;


        //     updateGameEventData.date = check.checkString(updateGameEventData.date, 'date');     
        //     updateGameEventData.date = check.dateIsValid(updateGameEventData.date, 'date');   
        //     updateGameEventData.startTime = check.checkTime(updateGameEventData.startTime, 'startTime');
        //     updateGameEventData.endTime = check.checkTime(updateGameEventData.endTime, 'endTime');
        //     updateGameEventData.startTime = check.convertStringToDate(updateGameEventData.date, updateGameEventData.startTime);

        //     updateGameEventData.endTime = check.convertStringToDate(updateGameEventData.date, updateGameEventData.endTime);
        //     updateGameEventData.startTime = check.checkDate(updateGameEventData.startTime, 'startTime');
        //     updateGameEventData.endTime = check.checkDate(updateGameEventData.endTime, 'endTime');

        //     updateGameEventData.minimumParticipants = check.checkNum(updateGameEventData.minParticipants, 'minimumParticipants');
        //     updateGameEventData.maximumParticipants = check.checkNum(updateGameEventData.maxParticipants, 'maximumParticipants');
        //  if (updateGameEventData.minimumParticipants < 2 || updateGameEventData.maximumParticipants > 30 )
        //  throw `min number of Participants should be 2 and maximum 30 `
        //     if (updateGameEventData.endTime > "22:00")
        //     throw `No event stays after 10 pm `

        //         let now = moment().format('YYYY-MM-DD');
        //         let current_time = moment().format("HH:mm")

        // if (now == updateGameEventData.date   )
        // {
        // }

        // let conflict = await data.users.checkUserConflict(userId, updateGameEventData.startTime, updateGameEventData.endTime);

        // if(conflict.conflicted){
        //     throw 'You are already registered for an event at this time.';
        // }

        let usersid = [];
        let event = await gameEvent.getGameEvent(updateGameEventData.gameEventId);
        event.participants.forEach((user) => {
            usersid.push(user.toString())
        });
        var title = event.title
        var emails = [];

        await usersid.forEach(async (users) => {
            let x = await usersData.getUser(users);
            // emails.push(x.email);
            await contactUs.emailSetup2(title, "edit", x.email);
        });


        await gameEvent.update(updateGameEventData.gameEventId, userId, updateGameEventData.title, updateGameEventData.status,
            updateGameEventData.sportCategory, updateGameEventData.description);

        return res.json({
            success: true
        });
    } catch (e) {
        return res.json({
            success: false,
            message: e.toString()
        });
        // return res.status(400).render('createGameEvent/createGameEvent', { "error": {
        //     error: e,
        //     input: updateGameEventData,
        //     minStartDate: nowStrDate, 

        //     userDetails: req.session.user
        // }
        //  });
    }
    /*
    try {
        const {
            title,
            status,
            sportCategory,
            description,
            area,
            address,
            latitude,
            longitude,
            startTime,
            endTime,
            minParticipants,
            maxParticipants
        } = updateGameEventData;
        const gameEvent = await data.gameEvent.create(userId, title, status, sportCategory, description, area, address, latitude,
            longitude, startTime, endTime, minParticipants, maxParticipants);
        //render the individual game page 
        if(gameEvent){
            res.redirect('/viewGameEvent/' + gameEvent._id);
        } else{
            res.status(404).json({status: "failure"});
        }
    } catch (e) {
        res.status(500).render('createGameEvent/createGameEvent', {
            error_flag: true,
            error: e,
            input: updateGameEventData, 
            minStartDate: nowStrDate, 
            userDetails: req.session.user
        })
    }
    */
});

module.exports = router;