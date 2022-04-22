const mongoCollections = require('../config/mongoCollections');
const comment = mongoCollections.comment;
const { ObjectId } = require('mongodb');
const check = require('../task/validation');

/* Find comments associated with the given event id*/
async function getCommentsForEvent(eventId){
    if(arguments.length != 1){ throw "getCommentsForEvent : pass one argument."};
    if(!eventId) throw "getCommentsForEvent: must pass eventId";
    let ID = check.checkId(eventId);
    const commentCollection = await comment();
    const eventComments =  await commentCollection.find({gameEventId: ObjectId(ID)}).sort({timestamp: -1}).toArray();
    for(let i =0; i<eventComments.length; i++){
        eventComments[i]._id = eventComments[i]._id.toString();
        eventComments[i].userId = eventComments[i].userId.toString();
        eventComments[i].gameEventId = eventComments[i].gameEventId.toString();
    }
    //queries the user collection using the poster id from the comment - adds the poster's name to the comment object.
    for(let i =0; i<eventComments.length; i++){
        const poster = await users.getUser(eventComments[i].userId);
        eventComments[i].name = poster.firstName + ' ' + poster.lastName;
    }
    return eventComments;
}

module.exports = {
    getCommentsForEvent
}
