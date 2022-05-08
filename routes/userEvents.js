const express = require('express');
const router = express.Router();
const data = require('../data');
const check = require('../task/validation');
const geocode = require('../public/js/geocode');
const contactUs = require('../data/contactus');
const { userEvents } = require('../data');
//const data = require('../data');
const gameEvent = data.gameEvent;
const usersData = require('../data/users');
// Global variable createGameEventData
var editGameEventData;

//Traditional (GET) Route
router.get('/', async (req, res) => {

    if (!req.session.user) {
        return res.redirect('/');
    }
    let userId = req.session.user.userID;
    try{
        userId = check.checkId(userId);
        let gameEvents = await data.userEvents.getAllGameEvents(userId);
        if (gameEvents) {
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            };
            gameEvents.forEach(async event => {
                event._id = event._id.toString();
                let startTime = new Date(event.startTime);
                let endTime = new Date(event.endTime);
                event.startTime = startTime.toLocaleDateString("en-US", options);
                event.endTime = endTime.toLocaleDateString("en-US", options);
            });
        }
        
        res.render('userEvents/userEvents', {gameEventsList: gameEvents, error_flag: false,
            userDetails: req.session.user, userId: userId});
    } catch (e){
        res.render('userEvents/userEvents', {errorAllEvents: e,error_flag: true,
            userDetails: req.session.user});
    }
});
/*
// (EDIT) Route: Main EDIT route
router.post('/edit/:id', async(req,res) => {
    editGameEventData = check.validateObjectXSS(req.body);
    let userId = req.session.user.userID;
    let coordinatorId = editGameEventData.coordinatorId;
    let gameEventId = check.validateXSS(req.params.id);

    //get min start time
    let now = new Date();
    now.setHours(now.getHours()+ 1);
    let startTimeMin = now.toLocaleTimeString([], { hour12:false, hour: '2-digit', minute: '2-digit' });

    try {
        userId = check.checkId(userId);
        coordinatorId = check.checkId(coordinatorId);
        gameEventId = check.checkId(gameEventId);
        editGameEventData.title = check.checkString(editGameEventData.title, 'title');
        if(editGameEventData.status !== "upcoming"){
            throw "User cannot edit an Old or Canceled gameEvent";
        }
        editGameEventData.sportCategory = check.checkString(editGameEventData.sportCategory, 'sportCategory');
        editGameEventData.description = check.checkString(editGameEventData.description, 'description');
        editGameEventData.address = check.checkString(editGameEventData.address, 'address');   
        editGameEventData.date = check.checkString(editGameEventData.date, 'date');   
        editGameEventData.date = check.dateIsValid(editGameEventData.date, 'date');    
        editGameEventData.startTime = check.checkTime(editGameEventData.startTime, 'startTime');
        editGameEventData.endTime = check.checkTime(editGameEventData.endTime, 'endTime');
        if (editGameEventData.startTime < startTimeMin){
            throw `Events can only be created for 1 hour after current time`;
        }
        if (editGameEventData.endTime > "22:00"){
            throw `No event stays after 10 pm `;
        }
        editGameEventData.startTime = check.convertStringToDate(editGameEventData.date, editGameEventData.startTime);
       
        editGameEventData.endTime = check.convertStringToDate(editGameEventData.date, editGameEventData.endTime);
        editGameEventData.startTime = check.checkDate(editGameEventData.startTime, 'startTime');
        editGameEventData.endTime = check.checkDate(editGameEventData.endTime, 'endTime');
        
        editGameEventData.minimumParticipants = check.checkNum(editGameEventData.minParticipants, 'minimumParticipants');
        editGameEventData.maximumParticipants = check.checkNum(editGameEventData.maxParticipants, 'maximumParticipants');

       
        await  data.userEvents.update(userId, gameEventId, coordinatorId, editGameEventData.title, editGameEventData.status, 
            editGameEventData.sportCategory,editGameEventData.description, editGameEventData.area, editGameEventData.address,
            editGameEventData.latiutude, editGameEventData.longitude, editGameEventData.startTime, editGameEventData.endTime,
            editGameEventData.minimumParticipants, editGameEventData.maximumParticipants);
// send email 

        res.json({success: true});
    } catch (e) {
        res.json({errorEdit: e, success: false});
    }
});
*/
/*
// (EDIT) Route: Partial HTML edit form to inject into div
router.post('/partialEditForm.html', async(req,res) =>{
    let userId = req.session.user.userID;
    let area = req.session.user.userArea;
    let gameEventId = check.validateXSS(req.body.gameEventId);
    let coordinatorId = check.validateXSS(req.body.coordinatorId);
    let nowStrDate =  new Date().toLocaleDateString('en-CA');
    res.render('userEvents/partialEditForm', {layout: null, userId: userId, gameEventId: gameEventId, minStartDate: nowStrDate,
                                              coordinatorId: coordinatorId, area: area});
});
*/

// (LEAVE) Route: get all remaining gameEvents that user is a part of after removing user from current gameEvent 
// For some reason I couldn't do "DELETE" methods in html forms
router.get('/leave/:id', async(req,res) =>{
    let gameEventId = check.validateXSS(req.params.id);
    let userId = req.session.user.userID;

    try{
        gameEventId = check.checkId(gameEventId);
        userId = check.checkId(userId);
        let retval = await data.userEvents.remove(userId, gameEventId);
        if(retval.userRemoved == true){
            res.json({userId: userId, success: true});
        } 
    } catch (e){
        return res.json({userId: userId, success: false, errorLeave: e});
    }
});

// (CANCEL) Route: get all remaining gameEvents that user is a part of after removing user from current gameEvent 

router.get('/cancel/:id', async(req,res) =>{
    if(!check.validateXSS(req.params.id)){
        return res.status(400).render('errors/error', {
            error: 'userEvents/cancel/:id GET: No id url parameters.'
        });
    }
    let gameEventId = check.validateXSS(req.params.id);
    let userId = req.session.user.userID;

    try{
        gameEventId = check.checkId(gameEventId);
        userId = check.checkId(userId);
        let retval = await data.userEvents.cancelEvent(userId, gameEventId);
        if(retval.canceled === true){
            // send email
            let usersid= [];
          let event = await gameEvent.getGameEvent(gameEventId);
          event.participants.forEach( (user) => {
            usersid.push(user.toString())
            
       });
       var title = event.title
var emails = [];
       
await usersid.forEach( async (users) => {
            let x = await usersData.getUser(users);
           // emails.push(x.email);
            await contactUs.emailSetup2( title, "Cancel", x.email );
       });
           
    //    await emails.forEach( async (users) => {
    //        let x = 9 ;
    // });
   //await contactUs.emailSetup2( title, "Cancel" );
            
   res.json({userId: userId, success: true});
        } 
    } catch (e){
        return res.json({userId: userId, success: false, errorCancel: e});
    }
});
module.exports = router;