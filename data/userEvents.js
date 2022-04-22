const mongoCollections = require('../config/mongoCollections');
const gameEvents = mongoCollections.gameEvent;
const { ObjectId } = require('mongodb');
const check = require('../task/validation');
const gameEventData = require('./gameEvent');


/* Given a userId, return all game events associated with that user */
async function getAllGameEvents (userId){
    userId = check.checkId(userId);
    const gameEventCollection = await gameEvents();
    const gameEventList = await gameEventCollection.find({participants: ObjectId(userId)}).toArray();

    if(gameEventList.length === 0){
        throw "Error: No gameEvents found for user."
    }

    gameEventList.forEach( (gameEvent) => {
        gameEvent._id = gameEvent._id.toString();
        gameEvent.userId = gameEvent.userId.toString();
        if(gameEvent.participants.length !== 0){
            for (let participant of gameEvent.participants){
                participant = participant.toString();
            }
        }
    });

    return gameEventList;
}

/* removes user from a gameEvent */
async function remove(userId, gameEventId){
    userId = check.checkId(userId);
    gameEventId = check.checkId(gameEventId);

    const gameEventCollection = await gameEvents();
    const gameEvent = await gameEventData.getGameEvent(gameEventId);
    let num_participants = gameEvent.currentNumberOfParticipants;

    const updated_info = await gameEventCollection.updateOne({_id: ObjectId(gameEventId)}, 
                        {$set: {currentNumberOfParticipants: num_participants - 1}}, {$pull: {participants: ObjectId(userId)}});
    if(updated_info.modifiedCount === 0){
        throw "Error: failed to remove user from gameEvent."
    }
    return {userRemoved: true};                    
} 

/* update a gameEvent */
async function update (userId, gameEventId, eventCoordinator, title, status, sportCategory, description, address, 
    latitude, longitude, startTime, endTime, minimumParticipants, maximumParticipants){
    userId = check.checkId(userId);
    gameEventId = check.checkId(gameEventId);
    const gameEventCollection = await gameEvents();
    const gameEvent = await gameEventData.getGameEvent(gameEventId);

    if(userId !== gameEvent.userId){
        throw 'Error: user is not the event coordinator.'
    }
    
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

    let updatedGameEvent = {
        userId: eventCoordinator, 
        title: title,
        status: status,
        sportCategory: sportCategory,
        description: description,
        address: address,
        latitude: latitude,
        longitude: longitude,
        startTime: startTime, 
        endTime: endTime, 
        minimumParticipants: minimumParticipants,
        maximumParticipants: maximumParticipants,
        currentNumberOfParticipants: gameEvent.currentNumberOfParticipants,
        participants: gameEvent.participants
    };

    const updatedInfo = await gameEventCollection.updateOne(
        {_id: ObjectId(gameEventId)}, 
        {$set: updatedGameEvent}
    );

    if(updatedInfo.modifiedCount === 0){
        throw "Error: Failed to update game event";
    }
    return {gameEventUpdated: true};
}

module.exports = {
    getAllGameEvents, 
    remove, 
    update
}