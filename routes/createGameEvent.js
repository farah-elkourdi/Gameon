const express = require('express');
const router = express.Router();
const data = require('../data');
const check = require('../task/validation');
const geocode = require('../public/js/geocode');

// Global variable createGameEventData
var createGameEventData;

// Function to validate address and fetch lat and long

function validateAddress(addressGeocode) {
    let addressResult = addressGeocode;
    if (addressResult.address.country_code !== 'us') {
        return res.status(400).render('createGameEvent', {
            error_flag: true,
            error: `Please enter a valid US address`,
            today: now
        })
    }
    createGameEventData.address = addressResult.display_name;
    createGameEventData.latitude = addressResult.lat;
    createGameEventData.longitude = addressResult.lon;
}

router.get('/', async (req, res) => {
    let now = new Date();
    let end = now.setHours(now.getHours() + 1);
    res.render('createGameEvent', {
        error_flag: false,
        today: now,
        limit: end
    });
});

router.post('/', async (req, res) => {
    let now = new Date();
    createGameEventData = req.body;
    try {
        createGameEventData.title = check.checkString(createGameEventData.title, 'title');
        /* How would we get coordinator userId? From the session. */
        // userId = check.checkId(userId);
        //createGameEventData.status = check.checkString(createGameEventData.status, 'status');
        createGameEventData.sportCategory = check.checkString(createGameEventData.sportCategory, 'sportCategory');
        createGameEventData.description = check.checkString(createGameEventData.description, 'description');
        createGameEventData.address = check.checkString(createGameEventData.address, 'address');
        /* Need to check if valid address */
        /* Need to check if longitude and latitude are correct */
        createGameEventData.startTime = check.checkDate(createGameEventData.startTime, 'startTime');
        createGameEventData.endTime = check.checkDate(createGameEventData.endTime, 'endTime');
        createGameEventData.minimumParticipants = check.checkNum(createGameEventData.minParticipants, 'minimumParticipants');
        createGameEventData.minimumParticipants = check.checkMinParticipantLimit(createGameEventData.sportCategory, createGameEventData.minimumParticipants, 'minimumParticipants');
        createGameEventData.maximumParticipants = check.checkNum(createGameEventData.maxParticipants, 'maximumParticipants');
        createGameEventData.maximumParticipants = check.checkMaxParticipantLimit(createGameEventData.sportCategory, createGameEventData.maximumParticipants, 'maximumParticipants');

        //Validating address using callback
        await geocode.validate(createGameEventData.address, validateAddress);

    } catch (e) {
        return res.status(400).render('createGameEvent', {
            error_flag: true,
            error: e,
            today: now
        })
    }

    try {
        const {
            userId,
            title,
            status,
            sportCategory,
            description,
            address,
            latitude,
            longitude,
            startTime,
            endTime,
            minimumParticipants,
            maximumParticipants
        } = createGameEventData;
        const gameEvent = await data.gameEvent.create(userId, title, status, sportCategory, description, address, latitude,
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
            today: now
        })
    }
});

module.exports = router;