const gameEvent = require('./gameEvent');
const gameEvents = mongoCollections.gameEvent;
const { ObjectId } = require('mongodb');
const check = require('../task/validation');

async function eventList(){
    const gameEventCollection = await gameEvents();
    const gameList = await gameEventCollection.findOne({_id: ObjectId(id)});

    let allEvent = []

    gameList.forEach( (value) => {
        value['_id'] = "" + value['_id'];

        allEvent.push({
            '_id': value['_id'],
            'userId': value['userId'],
            'title': value['title'],
            'sportCategory': value['sportCategory'],
            'description': value['description'],
            'address': value['address'],
            'startTime': value['startTime'],
            'endTime': value['endTime'],
            'minimumParticipants': value['minimumParticipants'],
            'minimumParticipants': value['minimumParticipants'],
        });
    });
    return gameList;
}

module.exports = {
    eventList
}