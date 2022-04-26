const express = require('express');
const router = express.Router();
const data = require('../data');
const check = require('../task/validation');

// Global variable createGameEventData
var createGameEventData;

router.get('/', async (req, res) => {
    if(!req.session.user){
        return res.redirect('/');
    }
    let now = new Date();
    let nowStrDate =  new Date().toLocaleDateString('en-CA');
    let startTimeMin =  now.toLocaleTimeString([], {hourCycle: 'h23', hour: '2-digit', minute: '2-digit' });

    res.render('createGameEvent', {
        error_flag: false,
        minStartDate: nowStrDate, 
        minStartTime: startTimeMin
    });
});

router.post('/', async (req, res) => {
    let now = new Date();
    let nowStrDate =  new Date().toLocaleDateString('en-CA');
 
    let startTimeMin = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    createGameEventData = req.body;
    let userId = req.session.user.userID;

    try {
        userId = check.checkId(userId);
        createGameEventData.title = check.checkString(createGameEventData.title, 'title');
        createGameEventData.status = "Upcoming";
        createGameEventData.sportCategory = check.checkString(createGameEventData.sportCategory, 'sportCategory');
        createGameEventData.description = check.checkString(createGameEventData.description, 'description');
        createGameEventData.address = check.checkString(createGameEventData.address, 'address');  
        createGameEventData.area = check.checkString(createGameEventData.area, 'area');

        createGameEventData.latitude = createGameEventData.latitude;
        createGameEventData.longitude = createGameEventData.longitude;

        createGameEventData.date = check.checkString(createGameEventData.date, 'date');        
        createGameEventData.startTime = check.checkTime(createGameEventData.startTime, 'startTime');
        createGameEventData.endTime = check.checkTime(createGameEventData.endTime, 'endTime');
        createGameEventData.startTime = check.convertStringToDate(createGameEventData.date, createGameEventData.startTime);
       
        createGameEventData.endTime = check.convertStringToDate(createGameEventData.date, createGameEventData.endTime);
        createGameEventData.startTime = check.checkDate(createGameEventData.startTime, 'startTime');
        createGameEventData.endTime = check.checkDate(createGameEventData.endTime, 'endTime');

        createGameEventData.minimumParticipants = check.checkNum(createGameEventData.minParticipants, 'minimumParticipants');
        createGameEventData.maximumParticipants = check.checkNum(createGameEventData.maxParticipants, 'maximumParticipants');
     

        
    } catch (e) {
        return res.status(400).render('createGameEvent', {
            error_flag: true,
            error: e,
            input: createGameEventData,
            minStartDate: nowStrDate, 
            minStartTime: startTimeMin
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
        } = createGameEventData;
        const gameEvent = await data.gameEvent.create(userId, title, status, sportCategory, description, area, address, latitude,
            longitude, startTime, endTime, minimumParticipants, maximumParticipants);
        /* render the individual game page */
        if (gameEvent.gameEventCreated) {
            res.status(200).json({
                status: "success"
            });
        } else {
            res.status(404).json({
                status: "failure"
            });
        }
    } catch (e) {
        res.status(500).render('createGameEvent', {
            error_flag: true,
            error: e,
            input: createGameEventData, 
            minStartDate: nowStrDate, 
            minStartTime: startTimeMin
        })
    }
});

module.exports = router;