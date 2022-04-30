const mongoCollections = require('../config/mongoCollections');
const gameEvents = mongoCollections.gameEvent;
const { ObjectId } = require('mongodb');
const check = require('../task/validation');

/* returns gameEvent by gameEvent Id */
async function getGameEvent(id) {
    id = check.checkId(id);
    const gameEventCollection = await gameEvents();
    const gameEvent = await gameEventCollection.findOne({
        _id: ObjectId(id)
    });

    if (gameEvent === null) {
        throw "Error: gameEvent not found"
    }
    gameEvent._id = gameEvent._id.toString();
    gameEvent.userId = gameEvent.userId.toString();

    if (gameEvent.participants.length !== 0) {
        for (let participant of gameEvent.participants) {
            participant = participant.toString();
        }
    }
    return gameEvent;
}

async function getGameEventbyArea(area){
    const gameEventCollection = await gameEvents();
    const gameEvent = (await gameEventCollection.find({area: area})).toArray();

    return gameEvent;
}

async function getGameEventbyAreaLimit(area, limitCount){
    const gameEventCollection = await gameEvents();
    const eventList = (await gameEventCollection.find({area: area}).limit(limitCount)).toArray();
    
    return eventList;
}

/***
 * NEEDS TO check validity of Longitude and Latitude
 */

/*create a gameEvent and insert it into the database*/
async function create(userId, title, status, sportCategory, description, area, address,
    latitude, longitude, startTime, endTime, minimumParticipants,
    maximumParticipants) {

    userId = check.checkId(userId);
    title = check.checkString(title, 'title');
    status = check.checkString(status, 'status');
    sportCategory = check.checkString(sportCategory, 'sportCategory');
    description = check.checkString(description, 'description');
    area = check.checkString(area, 'area');
    address = check.checkString(address, 'address');

    /* NEED to check if valid address */

    if (!check.checkCoordinates(longitude, latitude)) {
        throw "Error: coordinates are NOT valid"
    }

    startTime = check.checkDate(startTime, 'startTime');
    endTime = check.checkDate(endTime, 'endTime');

    if (!check.areValidTimes(startTime, endTime)) {
        throw "Error: endTime must be at least 1 hour after startTime"
    }

    minimumParticipants = check.checkNum(minimumParticipants, 'minimumParticipants');
    if (!check.validMinParticipantLimit(sportCategory, minimumParticipants)) {
        throw "Error: minimum participation limit is not valid"
    }
    maximumParticipants = check.checkNum(maximumParticipants, 'maximumParticipants');
    if (!check.validMaxParticipantLimit(sportCategory, maximumParticipants)) {
        throw "Error: maximum participation limit is not valid"
    }
    if (!check.validNumParticipants(minimumParticipants, maximumParticipants)) {
        throw "Error: minimum participants is greater than maximum participants"
    }

        let newGameEvent = {
            userId: userId, 
            title: title,
            status: status,
            sportCategory: sportCategory,
            description: description,
            area: area,
            address: address,
            startTime: startTime, 
            endTime: endTime, 
            minimumParticipants: minimumParticipants,
            maximumParticipants: maximumParticipants,
            currentNumberOfParticipants: 1,
            participants: [ObjectId(userId)]
        };

        const insert = await gameEventCollection.insertOne(newGameEvent);
        if(!insert.acknowledged || !insert.insertedId){
            throw "Error: could not add gameEvent";
        }
        newGameEvent._id = insert.insertedId;
        return newGameEvent;
}

module.exports = {
    create,
    getGameEvent,
    getGameEventbyArea,
    getGameEventbyAreaLimit
}