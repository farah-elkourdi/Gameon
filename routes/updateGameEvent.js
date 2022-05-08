const express = require('express');
const router = express.Router();
const data = require('../data');
const check = require('../task/validation');
const gameEvent = require('../data/gameEvent');
const moment = require('moment');
const { deserialize } = require('bson');
const { description } = require('../public/js/geocode');

// Global variable updateGameEventData
var updateGameEventData;

router.get('/:id', async (req, res) => {
    if(!req.session.user){
        return res.redirect('/');
    }
    if(!req.params){
        return res.status(400).render('errors/error', {
            error: 'updateGameEvent/:id GET: Missing request parameters'
        }); 
    }
    if(!req.params.id){
        return res.status(400).render('errors/error', {
            error: 'updateGameEvent/:id GET: No id in parameters'
        }); 
    }
    let id = xss(req.params.id);
    try{
        id = check.checkId(id);
    }
    catch(e){
        return res.status(400).render('errors/error', {
            error: e.toString()
        });
    }
    let event;
    try{
        event = await gameEvent.getGameEvent(id);
    }
    catch(e){
        return res.status(400).render('errors/error', {
            error: e.toString()
        });
    }
    let date = event.startDate;
    /* https://stackoverflow.com/a/34290167 */
    var d = new Date(date);
    date = [
    d.getFullYear(),
    ('0' + (d.getMonth() + 1)).slice(-2),
    ('0' + d.getDate()).slice(-2)
    ].join('-');

    let hours = d.getHours();
    if(hours < 10){
        hours = '0' + hours.toString();
    }
    let minutes = d.getMinutes();
    if(minutes < 10){
        minutes = '0' + minutes.toString();
    }
    let startTime = hours + ':' + minutes;

    date = event.endDate;
    d = new Date(date);
    
        hours = d.getHours();
        if(hours < 10){
            hours = '0' + hours.toString();
        }
        minutes = d.getMinutes();
        if(minutes < 10){
            minutes = '0' + minutes.toString();
        }
        let endTime = hours + ':' + minutes;

    // let startTimeMin = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let nowStrDate =  new Date().toLocaleDateString('en-CA');
    //console.log(event.description);
    res.render('updateGameEvent/updateGameEvent-Init', {
        minStartDate: nowStrDate, 
        userDetails: req.session.user,
        area: req.session.user.userArea,
        gameEventId: req.params.id,
        event: event,
        endTime: endTime,
        startTime: startTime,
        date: date
    });
});

router.post('/', async (req, res) => {
    updateGameEventData = req.body;
    let userId = req.session.user.userID;
    try {
        if(!userId) throw 'no user id';
        if(!updateGameEventData) throw 'Missing request body';
        userId = check.checkId(userId);
        if(!updateGameEventData.gameEventId) throw 'Missing gameEventId';
        updateGameEventData.gameEventId = xss(updateGameEventData.gameEventId);
        updateGameEventData.gameEventId = check.checkId(updateGameEventData.gameEventId, 'gameEventId');
        if(!updateGameEventData.title) throw 'Missing title';
        updateGameEventData.title = xss(updateGameEventData.title);
        updateGameEventData.title = check.checkString(updateGameEventData.title, 'title');
        updateGameEventData.status = "upcoming";
        if(!updateGameEventData.sportCategory) throw 'Missing sportCategory';
        updateGameEventData.sportCategory = xss(updateGameEventData.sportCategory);
        updateGameEventData.sportCategory = check.checkString(updateGameEventData.sportCategory, 'sportCategory');
        if(!updateGameEventData.description) throw 'Missing description';
        updateGameEventData.description = xss(updateGameEventData.description);
        updateGameEventData.description = check.checkString(updateGameEventData.description, 'description');
        if(!updateGameEventData.address) throw 'Missing address';
        updateGameEventData.address = xss(updateGameEventData.address);
        updateGameEventData.address = check.checkString(updateGameEventData.address, 'address');  

       // updateGameEventData.area = check.checkString(updateGameEventData.area, 'area');
       if(!updateGameEventData.latitude) throw 'Missing latitude';
       updateGameEventData.latitude = xss(updateGameEventData.latitude);
        updateGameEventData.latitude = updateGameEventData.latitude;
        if(!updateGameEventData.longitude) throw 'Missing longitude';
        updateGameEventData.longitude = xss(updateGameEventData.longitude);
        updateGameEventData.longitude = updateGameEventData.longitude;


        updateGameEventData.date = check.checkString(updateGameEventData.date, 'date');     
        updateGameEventData.date = check.dateIsValid(updateGameEventData.date, 'date');   
        updateGameEventData.startTime = check.checkTime(updateGameEventData.startTime, 'startTime');
        updateGameEventData.endTime = check.checkTime(updateGameEventData.endTime, 'endTime');
        updateGameEventData.startTime = check.convertStringToDate(updateGameEventData.date, updateGameEventData.startTime);
       
        updateGameEventData.endTime = check.convertStringToDate(updateGameEventData.date, updateGameEventData.endTime);
        updateGameEventData.startTime = check.checkDate(updateGameEventData.startTime, 'startTime');
        updateGameEventData.endTime = check.checkDate(updateGameEventData.endTime, 'endTime');

        updateGameEventData.minimumParticipants = check.checkNum(updateGameEventData.minParticipants, 'minimumParticipants');
        updateGameEventData.maximumParticipants = check.checkNum(updateGameEventData.maxParticipants, 'maximumParticipants');
     if (updateGameEventData.minimumParticipants < 2 || updateGameEventData.maximumParticipants > 30 )
     throw `min number of Participants should be 2 and maximum 30 `
        if (updateGameEventData.endTime > "22:00")
        throw `No event stays after 10 pm `

//         let now = moment().format('YYYY-MM-DD');
//         let current_time = moment().format("HH:mm")

// if (now == updateGameEventData.date   )
// {
// }

        let conflict = await data.users.checkUserConflict(userId, updateGameEventData.startTime, updateGameEventData.endTime);

        if(conflict.conflicted){
            throw 'You are already registered for an event at this time.';
        }


        await gameEvent.update(updateGameEventData.gameEventId, userId, updateGameEventData.title, updateGameEventData.status, 
            updateGameEventData.sportCategory, updateGameEventData.description, req.session.user.userArea,
            updateGameEventData.address, updateGameEventData.latitude, updateGameEventData.longitude, 
            updateGameEventData.startTime, updateGameEventData.endTime, updateGameEventData.minimumParticipants,
            updateGameEventData.maximumParticipants);

        
        return res.json({success: true});
    } catch (e) {
        return res.json({success: false, message: e.toString()});
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