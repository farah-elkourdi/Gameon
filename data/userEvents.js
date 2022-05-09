const mongoCollections = require('../config/mongoCollections');
const gameEvents = mongoCollections.gameEvent;
const users = mongoCollections.user;
const { ObjectId } = require('mongodb');
const check = require('../task/validation');
const gameEventData = require('./gameEvent');
const userData = require('./users');
const rateData = require('../data/rate');
const rate = mongoCollections.rate;

/* Given a userId, return all game events associated with that user */
async function getAllGameEvents (userId){
    userId = check.checkId(userId);
    const gameEventCollection = await gameEvents();
    const gameEventList = await gameEventCollection.find({participants: ObjectId(userId)}).toArray();

    if(gameEventList.length == 0){
        throw "No game events found."
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

/* given a gameEventId, changes status of gameEvent to canceled */
async function cancelEvent(userId, gameEventId){
    userId = check.checkId(userId);
    gameEventId = check.checkId(gameEventId);
    const gameEvent = await gameEventData.getGameEvent(gameEventId);
    if(userId !== gameEvent.userId){
        throw "Error: user is MUST be the event coordinator"
    }
    if(gameEvent.status.toLowerCase() === 'canceled'.toLowerCase()){
        throw "Error: Event is already Canceled"
    }
    if(gameEvent.status.toLowerCase() !== 'upcoming'.toLowerCase()){
        throw "Error: Events that are NOT 'upcoming' cannot be Canceled"
    }
    const gameEventUpdatedInfo = {
        status: "canceled"
    }
    const gameEventCollection = await gameEvents();

    const updatedInfo = await gameEventCollection.updateOne(
        {_id: ObjectId(gameEventId)}, 
        {$set: gameEventUpdatedInfo}
    );

    if(!updatedInfo.matchedCount && !updatedInfo.modifiedCount){
        throw "Error: Failed to update status to 'Canceled'"
    }

    return {canceled: true}
}   

/* checks if a user is a participant in an event */
async function checkParticipation(userId, gameEventId){
    userId = check.checkId(userId);
    gameEventId = check.checkId(gameEventId);
    let gameEvent;
    try{
        gameEvent = await gameEventData.getGameEvent(gameEventId);
    }
    catch(e){
        throw "checkParticipation: " + e.toString();
    }
    if(userId === gameEvent.userId){
        return {participant: true};
    }
    if(gameEvent.participants.map(x =>x.toString()).includes(userId)){
        return {participant: true};
    }
    return {participant: false}
}

async function checkArea(userId, gameEventId){
    userId = check.checkId(userId);
    gameEventId = check.checkId(gameEventId);
    let event, user;
    try{
        event = await gameEventData.getGameEvent(gameEventId);
        user = await userData.getUser(userId);
    }catch(e){
        throw "checkArea: " + e.toString();
    }
    //check the user's area and the event area align
    if(event.area != user.area){
        return {sameArea: false};
    } 
    return {sameArea: true};
}

/* removes user from a gameEvent */
async function remove(userId, gameEventId){
    userId = check.checkId(userId);
    gameEventId = check.checkId(gameEventId);
    const userFound = await userData.getUser(userId);
    const gameEventCollection = await gameEvents();
    const gameEvent = await gameEventData.getGameEvent(gameEventId);
    if(userId === gameEvent.userId){
        throw 'Error: Event coordinator cannot leave gameEvent.';
    }
    if(gameEvent.status.toLowerCase() !== "upcoming".toLowerCase()){
        throw 'Error: User cannot leave an Old or Canceled event';
    }
    let num_participants = gameEvent.currentNumberOfParticipants;
    const updated_info1 = await gameEventCollection.updateOne({_id: ObjectId(gameEventId)}, 
                        {$set: {currentNumberOfParticipants: num_participants -1}});
    if(updated_info1.modifiedCount === 0){
        throw "Error: Failed to deregister user for gameEvent."
    }
    const updated_info2 = await gameEventCollection.updateOne({_id: ObjectId(gameEventId)}, 
                        {$pull: {participants: ObjectId(userId)}});
    if(updated_info2.modifiedCount === 0){
        throw "Error: Failed to deregister user for gameEvent."
    }
    
    return {userRemoved: true};                    
}
/* registers a user for a gameEvent */
async function insert(userId, gameEventId){
    userId = check.checkId(userId);
    gameEventId = check.checkId(gameEventId);
    const userFound = await userData.getUser(userId);
    const gameEventCollection = await gameEvents();
    const gameEvent = await gameEventData.getGameEvent(gameEventId);
    let status = gameEvent.status;
    let num_participants = gameEvent.currentNumberOfParticipants;
    let max_participants = gameEvent.maximumParticipants;
    if(gameEvent.participants.map(x =>x.toString()).includes(userId)) throw 'Error: you are already registered for this event.'
    if(status.toLowerCase() !== 'upcoming'.toLowerCase()) throw 'Error: Game Event is not open for registration.';
    if(num_participants >= max_participants) throw 'Error: Game Event is already full.';

    let conflict;
            try{
                conflict = await userData.checkUserConflict(userId, gameEvent.startTime, gameEvent.endTime);
            }
            catch(e){
                throw e.toString();
            }

            if(conflict.conflicted){
                throw 'You are already registered for an event at this time.';
            }

    const updated_info1 = await gameEventCollection.updateOne({_id: ObjectId(gameEventId)}, 
                        {$set: {currentNumberOfParticipants: num_participants + 1}});
    if(updated_info1.modifiedCount === 0){
        throw "Error: failed to register user for gameEvent."
    }
    const updated_info2 = await gameEventCollection.updateOne({_id: ObjectId(gameEventId)}, 
                        {$push: {participants: ObjectId(userId)}});
    if(updated_info2.modifiedCount === 0){
        throw "Error: failed to register user for gameEvent."
    }
    return {userInserted: true};  
}

async function getAllGameEventsRating (userId){
    userId = check.checkId(userId);
    const rateCollection = await rate();
    var rating = await rateCollection.find({userId: userId}).toArray();

    const gameEventCollection = await gameEvents();
    
    const gameEventList = await gameEventCollection.find({participants: ObjectId(userId), userId: {$ne: userId} ,status: "old"}).toArray();

    if(gameEventList.length == 0){
        throw "No game events found."
    }
    var lstevents = [];

    gameEventList.forEach( (gameEvent) => {
        gameEvent._id = gameEvent._id.toString();
        gameEvent.userId = gameEvent.userId.toString();
        if(gameEvent.participants.length !== 0){
            for (let participant of gameEvent.participants){
                participant = participant.toString();
            }
        }
    });

    rating.forEach( (rate) => {
    gameEventList.forEach( (gameEvent) => {      
if (rate.gameEventId ==  gameEvent._id )
lstevents.push(gameEvent);
        });    
    });

//     lstevents.forEach( (rate) => {

//         gameEventList.pop(rate);
            
//         });

//     
// }
if (lstevents)
{

var filteredArray = gameEventList.filter(item => !lstevents.includes(item))
return filteredArray;
}
else
{
    return gameEventList
}
}

module.exports = {
    getAllGameEvents, 
    remove, 
    insert,
    checkParticipation,
    checkArea, 
    cancelEvent,
    getAllGameEventsRating
}