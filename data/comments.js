const mongoCollections = require('../config/mongoCollections');
const comment = mongoCollections.comment;
const { ObjectId } = require('mongodb');
const check = require('../task/validation');
const userEvents = require('./userEvents');

/* Find comments associated with the given event id*/
module.exports = {
async getCommentsForEvent(eventId){
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
},
async postComment(userId, gameEventId, comment, timestamp){
    /* input checking */
    if(arguments.length != 4) throw "postComment: pass 4 arguments.";
    if(!userId) throw "postComment: pass userId.";
    if(!gameEventId) throw "postComment: pass gameEventId.";
    if(!comment) throw "postComment: pass comment.";
    if(!timestamp) throw "postComment: pass timestamp.";
    userId = check.checkId(userId);
    gameEventId = check.checkId(gameEventId);
    comment = check.checkString(comment, 'comment');
    timestamp = check.checkDate(timestamp, 'timestamp');

    //check if the user is a participant in the event
    let joined;
    try{
        joined = await userEvents.checkParticipation(userId, gameEventId);
    }
    catch(e){
        throw e.toString();
    }
    if(!joined.participant) throw "user must be a participant in the event to post a comment.";
    
    const commentCollection = await comment();

    let newComment = {
        userId : userId,
        gameEventId : gameEventId,
        comment : comment,
        timestamp : timestamp
    };

    const insert = await commentCollection.insertOne(newComment);
    if(!insert.acknowledged || !insert.insertedId){
        throw "Error: could not post comment";
    }
    newComment._id = insert.insertedId;
    return newComment;
}
};
