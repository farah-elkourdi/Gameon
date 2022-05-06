const express = require('express');
const router = express.Router();
const gameEvent = require('../data/gameEvent');
const rate = require('../data/rate');

// Router configuration

router.get('/', async (req, res) => {
    let events = await gameEvent.getGameEventLandingPage();
    if (events) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        events.forEach(event => {
            event._id = event._id.toString();
            let startTime = new Date(event.startTime);
            let endTime = new Date(event.endTime);
            event.startTime = startTime.toLocaleDateString("en-US", options);
            event.endTime = endTime.toLocaleDateString("en-US", options);
        });
    }

    // Top 5 ratings
    let ratings = await rate.getTopRatings();

    res.render('index/landingPage', {
        title: "Home",
        userDetails: req.session.user,
        gameEvents: events,
        ratings: ratings
    });
});

module.exports = router;