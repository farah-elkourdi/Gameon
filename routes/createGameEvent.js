const express = require('express');
const router = express.Router();
const data = require('../data');
const check = require('../task/validation');

router.get('/', async (req, res) => {
    let now = new Date();
    res.render('createGameEvent', {error_flag: false, today: now});
});

router.post('/', async(req,res) => {
    let now = new Date();
    const createGameEventData = req.body;
    try{
        createGameEventData.title = check.checkString(createGameEventData.title , 'title');
        /* How would we get coordinator userId? From the session. */
        // userId = check.checkId(userId);
        createGameEventData.status = check.checkString(createGameEventData.status, 'status');
        createGameEventData.sportCategory = check.checkString(createGameEventData.sportCategory, 'sportCategory');
        createGameEventData.description = check.checkString(createGameEventData.description, 'description');
        createGameEventData.address = check.checkString(createGameEventData.address, 'address');
        /* Need to check if valid address */
        /* Need to check if longitude and latitude are correct*/
        createGameEventData.startTime = check.checkDate(createGameEventData.startTime, 'startTime');
        createGameEventData.endTime = check.checkDate(createGameEventData.endTime, 'endTime');
        createGameEventData.minimumParticipants = check.checkNum(createGameEventData.minimumParticipants, 'minimumParticipants');
        createGameEventData.minimumParticipants = check.checkMinParticipantLimit(sportCategory, createGameEventData.minimumParticipants, 'minimumParticipants');
        createGameEventData.maximumParticipants = check.checkNum(createGameEventData.maximumParticipants, 'maximumParticipants');
        createGameEventData.maximumParticipants = check.checkMaxParticipantLimit(sportCategory, createGameEventData.maximumParticipants, 'maximumParticipants');  
    } catch (e){
        return res.status(400).render('createGameEvent', {error_flag: true, error: e, today: now})
    }

    try{
        const {userId, title, status, sportCategory, description, address, latitude, longitude, startTime, endTime,
                minimumParticipants, maximumParticipants} = createGameEventData;
        const gameEvent = await data.gameEvent.create(userId, title, status, sportCategory, description, address, latitude, 
                        longitude, startTime, endTime, minimumParticipants, maximumParticipants);
        /* render the individual game page */
        if(gameEvent.gameEventCreated){
            res.status(200).json({status: "success"});
        } else{
            res.status(404).json({status: "failure"});
        }
    } catch(e){
        res.status(500).render('createGameEvent', {error_flag: true, error: e, today: now})
    }
});

module.exports = router;