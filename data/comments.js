const mongoCollections = require('../config/mongoCollections');
const comment = mongoCollections.comment;
const { ObjectId } = require('mongodb');
const check = require('../task/validation');
const userEvents = require('./userEvents');
const users = require('./users');

/* Find comments associated with the given event id*/
module.exports = {
    async getCommentsForEvent(eventId){
    if(arguments.length != 1){ throw "getCommentsForEvent : pass one argument."};
    if(!eventId) throw "getCommentsForEvent: must pass eventId";
    let ID = check.checkId(eventId);
    const commentCollection = await comment();
    const eventComments =  await commentCollection.find({gameEventId: ID}).sort({timestamp: -1}).toArray();
    for(let i =0; i<eventComments.length; i++){
        eventComments[i]._id = eventComments[i]._id.toString();
        eventComments[i].userId = eventComments[i].userId.toString();
        eventComments[i].gameEventId = eventComments[i].gameEventId.toString();
    }
    //queries the user collection using the poster id from the comment - adds the poster's name to the comment object.
    for(let i =0; i<eventComments.length; i++){
        const poster = await users.getUser(eventComments[i].userId);
        eventComments[i].name = poster.firstName + ' ' + poster.lastName;
        //set initials for display
        eventComments[i].initials = poster.firstName.charAt(0).toUpperCase() + poster.lastName.charAt(0).toUpperCase(); 
    }
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    //Update comments
    for (let i = 0; i < eventComments.length; i++) {
        let comment = eventComments[i];
        let timestamp = new Date(comment.timestamp);
        eventComments[i].timestamp = timestamp.toLocaleDateString("en-US", options);
    }
    return eventComments;
},
async postComment(userId, gameEventId, commentStr, timestamp, email){
    /* input checking */
    if(arguments.length != 5) throw "postComment: pass 5 arguments.";
    if(!userId) throw "postComment: pass userId.";
    if(!gameEventId) throw "postComment: pass gameEventId.";
    if(!commentStr) throw "postComment: pass comment.";
    if(!timestamp) throw "postComment: pass timestamp.";
    if(!email) throw "postComment: pass email.";
    try{
        userId = check.checkId(userId);
    gameEventId = check.checkId(gameEventId);
    commentStr = check.checkString(commentStr, 'comment');
    timestamp = check.checkDate(timestamp, 'timestamp');
    }catch(e){
        throw 'postComment: ' + e.toString();
    }
    if (! check.checkEmail(email))
    throw "postComment: badly formatted email.";
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
        comment : commentStr,
        timestamp : timestamp,
        email: email
    };

    const insert = await commentCollection.insertOne(newComment);
    if(!insert.acknowledged || !insert.insertedId){
        throw "Error: could not post comment";
    }
    newComment._id = insert.insertedId;
    return newComment;
}
};
