const mongoCollections = require('../config/mongoCollections');
const gameEvents = mongoCollections.gameEvent;
const { ObjectId } = require('mongodb');
const check = require('../task/validation');

/* returns gameEvent by gameEvent Id */
async function getGameEvent(id){
    id = check.checkId(id);
    const gameEventCollection = await gameEvents();
    const gameEvent = await gameEventCollection.findOne({_id: ObjectId(id)});

    if(gameEvent === null){
        throw "Error: gameEvent not found"
    }
    gameEvent._id = gameEvent._id.toString();
    gameEvent.userId = gameEvent.userId.toString();

    if(gameEvent.participants.length !== 0){
        for (let participant of gameEvent.participants){
            participant = participant.toString();
        }
    }
    return gameEvent;
} 

/***
 * NEEDS TO check validity of Longitude and Latitude
 */

/*create a gameEvent and insert it into the database*/
async function create (userId, title, status, sportCategory, description, address, 
            startTime, endTime, minimumParticipants, 
            maximumParticipants){

        userId = check.checkId(userId);
        title = check.checkString(title, 'title');
        status = check.checkString(status, 'status');
        sportCategory = check.checkString(sportCategory, 'sportCategory');
        description = check.checkString(description, 'description');
        address = check.checkString(address, 'address');
        /* Need to check if valid address */
        /* Need to check if longitude and latitude are correct*/
        startTime = check.checkDate(startTime, 'startTime');
        endTime = check.checkDate(endTime, 'endTime');
        minimumParticipants = check.checkNum(minimumParticipants, 'minimumParticipants');
        minimumParticipants = check.checkMinParticipantLimit(sportCategory, minimumParticipants, 'minimumParticipants');
        maximumParticipants = check.checkNum(maximumParticipants, 'maximumParticipants');
        maximumParticipants = check.checkMaxParticipantLimit(sportCategory, maximumParticipants, 'maximumParticipants');

        const gameEventCollection = await gameEvents();

        let newGameEvent = {
            userId: userId, 
            title: title,
            status: status,
            sportCategory: sportCategory,
            description: description,
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
    getGameEvent
}