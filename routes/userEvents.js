const express = require('express');
const router = express.Router();
const data = require('../data');
const check = require('../task/validation');

const geocode = require('../public/js/geocode');

// Global variable createGameEventData
var editGameEventData;

router.get('/', async (req, res) => {
    let nowStrDate =  new Date().toLocaleDateString('en-CA');

    if (!req.session.user) {
        return res.redirect('/');
    }
    try{
        let userId = req.session.user.userID;
        userId = check.checkId(userId);
        let gameEvents = await data.userEvents.getAllGameEvents(userId);
        res.render('userEvents/userEvents', {errorFlagAllEvents: false, gameEventsList: gameEvents, today: nowStrDate});
    } catch (e){
        res.status(404).render('userEvents/userEvents', {errorFlagAllEvents: true, errorAllEvents: e});
    }
});

router.post('/:id', async(req,res) => {
    let nowStrDate =  new Date().toLocaleDateString('en-CA');

    editGameEventData = req.body;
    let userId = req.session.user.userID;
    let coordinatorId = editGameEventData.coordinatorId;
    let gameEventId = req.params.id;

    try {
        userId = check.checkId(userId);
        coordinatorId = check.checkId(coordinatorId);
        gameEventId = check.checkId(gameEventId);
        editGameEventData.title = check.checkString(editGameEventData.title, 'title');
        editGameEventData.status = check.checkString(editGameEventData.status, 'status');
        editGameEventData.sportCategory = check.checkString(editGameEventData.sportCategory, 'sportCategory');
        editGameEventData.description = check.checkString(editGameEventData.description, 'description');
        editGameEventData.address = check.checkString(editGameEventData.address, 'address');   
        editGameEventData.area =  check.checkString(editGameEventData.area, 'area');
        editGameEventData.date = check.checkString(editGameEventData.date, 'date');   
        editGameEventData.date = check.dateIsValid(editGameEventData.date, 'date');    
        editGameEventData.startTime = check.checkTime(editGameEventData.startTime, 'startTime');
        editGameEventData.endTime = check.checkTime(editGameEventData.endTime, 'endTime');

        editGameEventData.startTime = check.convertStringToDate(editGameEventData.date, editGameEventData.startTime);
       
        editGameEventData.endTime = check.convertStringToDate(editGameEventData.date, editGameEventData.endTime);
        editGameEventData.startTime = check.checkDate(editGameEventData.startTime, 'startTime');
        editGameEventData.endTime = check.checkDate(editGameEventData.endTime, 'endTime');

        editGameEventData.minimumParticipants = check.checkNum(editGameEventData.minParticipants, 'minimumParticipants');
        editGameEventData.maximumParticipants = check.checkNum(editGameEventData.maxParticipants, 'maximumParticipants');

        //Validating address using callback
        await geocode.validate(editGameEventData.address, validateAddress);

        /* HOW should we validate/check longitude and latitude here in routes?*/

    } catch (e) {
        return res.status(400).render('userEvents/userEvents', {
            error_flag: true,
            error: e,
            today: nowStrDate, 
            input: editGameEventData
        })
    }

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
            minimumParticipants,
            maximumParticipants
        } = editGameEventData;
        const gameEvent = await data.userEvents.update(userId, gameEventId, eventCoordinator, title, status, sportCategory, description, area, address, latitude,
            longitude, startTime, endTime, minimumParticipants, maximumParticipants);

        /* rerender userEvents Page with updated data */
        if (gameEvent.gameEventUpdated) {
            res.status(200).json({
                status: "success"
            });
        } else {
            res.status(404).json({
                status: "failure"
            });
        }
    } catch (e) {
        res.status(500).render('userEvents/userEvents', {
            error_flag: true,
            error: e,
            today: nowStrDate, 
            input: editGameEventData
        })
    }
});

router.delete('/:id', async(req,res) =>{
    let nowStrDate =  new Date().toLocaleDateString('en-CA');
    let gameEventId = req.params.id;
    let userId = req.session.user.userID;

    try{
        gameEventId = check.checkId(gameEventId);
        userId = check.checkId(userId);
        let updatedGameEvents = await data.userEvents.remove(userId, gameEventId);
        res.status(200).render('userEvents/userEvents', {errorFlagOneEvent: false, gameEventsList: updatedGameEvents, today: nowStrDate});
    } catch (e){
        return res.status(400).render('userEvents/userEvents', {errorFlagAllEvents: true, errorAllEvents: e});
    }
});

module.exports = router;