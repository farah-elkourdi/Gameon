const express = require('express');
const router = express.Router();
const data = require('../data');
const check = require('../task/validation');

router.get('/', async (req, res) => {
    let now = new Date();
    let end = now.setHours(now.getHours() + 1);
        //check if the user is signed in...
        if(!req.session.user){
            return res.redirect('/');
        }
    res.render('createGameEvent', {error_flag: false, today: now, limit: end });
});

router.post('/', async(req,res) => {
    let now = new Date();
    const createGameEventData = req.body;
    let userId;
    try{
        //check if the user is signed in...
    if(!req.session.user){
        return res.redirect('/');
    }
    
    //get current user id
        userId = req.session.user.userID;
        createGameEventData.userId = check.checkId(userId);
        createGameEventData.title = check.checkString(createGameEventData.title , 'title');
        createGameEventData.status = 'upcoming';
        /* needs an initial status, so we can set it as upcoming */
        createGameEventData.sportCategory = check.checkString(createGameEventData.sportCategory, 'sportCategory');
        createGameEventData.description = check.checkString(createGameEventData.description, 'description');
        createGameEventData.address = check.checkString(createGameEventData.address, 'address');
        /* Need to check if valid address */
        /* Need to check if longitude and latitude are correct */
        createGameEventData.startTime = check.checkDate(createGameEventData.startTime, 'startTime');
        createGameEventData.endTime = check.checkDate(createGameEventData.endTime, 'endTime');
        check.checkNum(createGameEventData.minParticipants, 'minimumParticipants');
        createGameEventData.minParticipants = check.checkMinParticipantLimit(createGameEventData.sportCategory, createGameEventData.minParticipants, 'minimumParticipants');
        check.checkNum(createGameEventData.maxParticipants, 'maximumParticipants');
        createGameEventData.maxParticipants = check.checkMaxParticipantLimit(createGameEventData.sportCategory, createGameEventData.maxParticipants, 'maximumParticipants');  
    } catch (e){
        return res.status(400).render('createGameEvent', {error_flag: true, error: e, today: now})
    }

    try{
        /*
        const {title, sportCategory, description, address, startTime, endTime, minimumParticipants, maximumParticipants,
        userId, status} = createGameEventData;
        */
    
        const gameEvent = await data.gameEvent.create(createGameEventData.userId, createGameEventData.title, createGameEventData.status, createGameEventData.sportCategory, createGameEventData.description, createGameEventData.address, createGameEventData.startTime, createGameEventData.endTime, createGameEventData.minParticipants, createGameEventData.maxParticipants);
        /* render the individual game page */
        if(gameEvent){
            res.redirect('/viewGameEvent/' + gameEvent._id);
        } else{
            res.status(404).json({status: "failure"});
        }
    } catch(e){
        res.status(500).render('createGameEvent', {error_flag: true, error: e, today: now})
    }
});

module.exports = router;