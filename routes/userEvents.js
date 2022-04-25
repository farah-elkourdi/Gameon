const express = require('express');
const router = express.Router();
const data = require('../data');
const check = require('../task/validation');

router.get('/', async (req, res) => {
    if (!req.session.user) {
        res.redirect("/");
    }

    try{
        let userId = req.session.user.userID;
        userId = check.checkId(userId);
        let gameEvents = await data.userEvents.getAllGameEvents(userId);
        res.render('userEvents/userEvents', {gameEventsList: gameEvents});
    } catch (e){
        res.status(500).render('userEvents/userEvents', {errorFlag: true, error: e});
    }
});

router.post('/', async(req,res) => {

});

router.delete('/:id', async(req,res) =>{
    try{
        let gameEventId = req.params.id;
        gameEventId = check.checkId(req.params.id);
        await data.gameEvent.getGameEvent(gameEventId);
    } catch (e){
        res.status(404).json({error: 'gameEvent not found'});
        return;
    }

    try{   
        let gameEvents = await data.userEvents.remove(userId, req.params.id);
        res.status(200).render('userEvents/userEvents', {errorFlag: false, gameEventsList: gameEvents});
    } catch (e){
        res.status(500).render('userEvents/userEvents', {errorFlag: true, error: e, gameEventsList: gameEvents});
    }
});

module.exports = router;