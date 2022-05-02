const express = require('express');
const router = express.Router();
const data = require('../data');
const check = require('../task/validation');
const gameEvent = require('../data/gameEvent');

// Global variable createGameEventData
var createGameEventData;

router.get('/', async (req, res) => {
    if(!req.session.user){
        return res.redirect('/');
    }
    
    // let startTimeMin = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let nowStrDate =  new Date().toLocaleDateString('en-CA');
    
    
    res.render('createGameEvent/createGameEvent', {
        minStartDate: nowStrDate, 
        userDetails: req.session.user
    });
});

router.post('/', async (req, res) => {
    
    let nowStrDate =  new Date().toLocaleDateString('en-CA');
    

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
        createGameEventData.date = check.dateIsValid(createGameEventData.date, 'date');   
        createGameEventData.startTime = check.checkTime(createGameEventData.startTime, 'startTime');
        createGameEventData.endTime = check.checkTime(createGameEventData.endTime, 'endTime');
        createGameEventData.startTime = check.convertStringToDate(createGameEventData.date, createGameEventData.startTime);
       
        createGameEventData.endTime = check.convertStringToDate(createGameEventData.date, createGameEventData.endTime);
        createGameEventData.startTime = check.checkDate(createGameEventData.startTime, 'startTime');
        createGameEventData.endTime = check.checkDate(createGameEventData.endTime, 'endTime');

        createGameEventData.minimumParticipants = check.checkNum(createGameEventData.minParticipants, 'minimumParticipants');
        createGameEventData.maximumParticipants = check.checkNum(createGameEventData.maxParticipants, 'maximumParticipants');
     
        await gameEvent.create(userId, createGameEventData.title, createGameEventData.status, 
            createGameEventData.sportCategory, createGameEventData.description, createGameEventData.area,
            createGameEventData.address, createGameEventData.latitude, createGameEventData.longitude, 
            createGameEventData.startTime, createGameEventData.endTime, createGameEventData.minimumParticipants,
            createGameEventData.maximumParticipants);

        
        return res.redirect('/eventList');
    } catch (e) {
        return res.json({success: false, message: e});
        // return res.status(400).render('createGameEvent/createGameEvent', { "error": {
        //     error: e,
        //     input: createGameEventData,
        //     minStartDate: nowStrDate, 

        //     userDetails: req.session.user
        // }
      //  });
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
            minParticipants,
            maxParticipants
        } = createGameEventData;
        const gameEvent = await data.gameEvent.create(userId, title, status, sportCategory, description, area, address, latitude,
            longitude, startTime, endTime, minParticipants, maxParticipants);
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
        res.status(500).render('createGameEvent/createGameEvent', {
            error_flag: true,
            error: e,
            input: createGameEventData, 
            minStartDate: nowStrDate, 
            userDetails: req.session.user
        })
    }
});

module.exports = router;