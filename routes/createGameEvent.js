const express = require('express');
const router = express.Router();
const data = require('../data');
const check = require('../task/validation');
const gameEvent = require('../data/gameEvent');
const moment = require('moment');

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
        userDetails: req.session.user,
        area: req.session.user.userArea,
    });
});

router.post('/', async (req, res) => {
    createGameEventData = check.validateObjectXSS(req.body);
    let userId = req.session.user.userID;

    let now = new Date();
  
    now.setHours(now.getHours()+ 1);
    let startTimeMin = now.toLocaleTimeString([], { hour12:false, hour: '2-digit', minute: '2-digit' });
    
    let startTimeMinDate = new Date(now);


    try {
        userId = check.checkId(userId);
        if(!userId) throw 'no user id';
        if(!createGameEventData) throw 'Missing request body';
        createGameEventData.title = createGameEventData.title;
        if(!createGameEventData.title) throw 'Missing title';
        createGameEventData.title = check.checkString(createGameEventData.title, 'title');
        createGameEventData.status = "upcoming";
        createGameEventData.sportCategory = createGameEventData.sportCategory;
        if(!createGameEventData.sportCategory) throw 'Missing sportCategory';
        createGameEventData.sportCategory = check.checkString(createGameEventData.sportCategory, 'sportCategory');
        createGameEventData.description = createGameEventData.description;
        if(!createGameEventData.description) throw 'Missing description';
        createGameEventData.description = check.checkString(createGameEventData.description, 'description');
        createGameEventData.address = createGameEventData.address;
        if(!createGameEventData.address) throw 'updateGameEvent: Missing address';
        createGameEventData.address = check.checkString(createGameEventData.address, 'address');  

       // createGameEventData.area = check.checkString(createGameEventData.area, 'area');
       createGameEventData.latitude = createGameEventData.latitude;
       if(!createGameEventData.latitude) throw 'updateGameEvent: Missing latitude';
        createGameEventData.latitude = createGameEventData.latitude;
        createGameEventData.longitude = createGameEventData.longitude;
        if(!createGameEventData.longitude) throw 'updateGameEvent: Missing longitude';
        createGameEventData.longitude = createGameEventData.longitude;


        createGameEventData.date = check.checkString(createGameEventData.date, 'date');     
        createGameEventData.date = check.dateIsValid(createGameEventData.date, 'date');  
        
        if (createGameEventData.startTime < startTimeMinDate){
            throw `Events can only be created for 1 hour after current time`;
        }
        createGameEventData.startTime = check.checkTime(createGameEventData.startTime, 'startTime');
        createGameEventData.endTime = check.checkTime(createGameEventData.endTime, 'endTime');
        if (createGameEventData.endTime > "22:00"){
            throw `No event stays after 10 pm `;
        }
        createGameEventData.startTime = check.convertStringToDate(createGameEventData.date, createGameEventData.startTime);
        
        createGameEventData.endTime = check.convertStringToDate(createGameEventData.date, createGameEventData.endTime);
        createGameEventData.startTime = check.checkDate(createGameEventData.startTime, 'startTime');
        createGameEventData.endTime = check.checkDate(createGameEventData.endTime, 'endTime');
        
        // if (createGameEventData.startTime < startTimeMin){
        //     throw `Events can only be created for 1 hour after current time`;
        // }
        createGameEventData.minimumParticipants = check.checkNum(createGameEventData.minParticipants, 'minimumParticipants');
        createGameEventData.maximumParticipants = check.checkNum(createGameEventData.maxParticipants, 'maximumParticipants');
        if (createGameEventData.minimumParticipants < 2 || createGameEventData.maximumParticipants > 30 ){
            throw `Min number of Participants should be 2 and maximum 30 `;
        }
        if (createGameEventData.minimumParticipants === createGameEventData.maximumParticipants ){
            throw `Min participants cannot be same as max participants `;
        }

//         let now = moment().format('YYYY-MM-DD');
//         let current_time = moment().format("HH:mm")

// if (now == createGameEventData.date   )
// {
// }
       

       
        await gameEvent.create(userId, createGameEventData.title, createGameEventData.status, 
            createGameEventData.sportCategory, createGameEventData.description, req.session.user.userArea,
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
        } = createGameEventData;
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
            input: createGameEventData, 
            minStartDate: nowStrDate, 
            userDetails: req.session.user
        })
    }
    */
});

module.exports = router;