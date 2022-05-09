const mongoCollections = require('../config/mongoCollections');
const moment = require('moment');
const gameEvents = mongoCollections.gameEvent;
const users = mongoCollections.user;
const userData = require('./users');
const {
    ObjectId
} = require('mongodb');
const check = require('../task/validation');

/* returns gameEvent by gameEvent Id */
async function getGameEvent(id) {
    if(arguments.length != 1) throw "getGameEvent: pass 1 argument.";
    if(!id) throw 'getGameEvent: supply id';
    try{
        id = check.checkId(id);
    }
    catch(e){
        throw 'getGameEvent: ' + e.toString();
    }
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

async function getGameEventbyArea(area) {
    if(arguments.length != 1) throw "getGameEventbyArea: pass 1 argument.";
    if(!area) throw 'getGameEventbyArea: supply area';
    try{
        area = check.checkString(area, 'area');
    }catch(e){
        throw 'getGameEventbyArea: ' + e.toString();
    }
    if(!check.checkValidationDlArea(area)) throw 'getGameEventbyArea: invalid area';

    const now = new Date(Date.now());
    const gameEventCollection = await gameEvents();
    const gameEvent = await gameEventCollection.aggregate([{
            $addFields: {
                userId: {
                    $toObjectId: "$userId"
                }
            }
        },
        {
            $lookup: {
                from: "user",
                localField: "userId",
                foreignField: "_id",
                as: "userData"
            }
        },
        {
            $unwind: "$userData"
        },
        {
            $project: {
                _id: 1,
                title: 1,
                name: {
                    $concat: ["$userData.firstName", " ", "$userData.lastName"]
                },
                sportCategory: 1,
                description: 1,
                area: 1,
                address: 1,
                latitude: 1,
                longitude: 1,
                startTime: 1,
                endTime: 1,
                minimumParticipants: 1,
                maximumParticipants: 1,
                currentNumberOfParticipants: 1,
                status: 1
            }
        },
        {
            $match: {
                $and: [{
                        area: area
                    },
                    {
                        status: /^upcoming$/i
                    },
                    {
                        startTime: {
                            $gte: now
                        }
                    }
                ]
            }
        }
    ]).sort({
        startTime: 1
    }).toArray();

    return gameEvent;
}

async function getGameEventbySearchArea(searchText, area) {
    if(arguments.length != 2) throw "getGameEventbySearchArea: pass 2 arguments.";
    if(!searchText) throw 'getGameEventbySearchArea: supply searchText.';
    if(!area) throw 'getGameEventbySearchArea: supply area'
    try{
        area = check.checkString(area, 'area');
        searchText = check.checkString(searchText, 'searchText');
    }catch(e){
        throw 'getGameEventbySearchArea: ' + e.toString();
    }
    if(!check.checkValidationDlArea(area)) throw 'getGameEventbySearchArea: invalid area';

    const now = new Date(Date.now());
    const gameEventCollection = await gameEvents();
    const gameEvent = await gameEventCollection.aggregate([{
            $addFields: {
                userId: {
                    $toObjectId: "$userId"
                }
            }
        },
        {
            $lookup: {
                from: "user",
                localField: "userId",
                foreignField: "_id",
                as: "userData"
            }
        },
        {
            $unwind: "$userData"
        },
        {
            $project: {
                _id: 1,
                title: 1,
                name: {
                    $concat: ["$userData.firstName", " ", "$userData.lastName"]
                },
                sportCategory: 1,
                description: 1,
                area: 1,
                address: 1,
                latitude: 1,
                longitude: 1,
                startTime: 1,
                endTime: 1,
                minimumParticipants: 1,
                maximumParticipants: 1,
                currentNumberOfParticipants: 1,
                status: 1
            }
        },
        {
            $match: {
                $and: [{
                        $or: [{
                                title: {
                                    $regex: ".*" + searchText + ".*",
                                    $options: 'i'
                                }
                            },
                            {
                                name: {
                                    $regex: ".*" + searchText + ".*",
                                    $options: 'i'
                                }
                            }
                        ]
                    },
                    {
                        area: area
                    },
                    {
                        status: /^upcoming$/i
                    },
                    {
                        startTime: {
                            $gte: now
                        }
                    }
                ]
            }
        }
    ]).sort({
        startTime: 1
    }).toArray();
    return gameEvent;
}

async function getGameEventbyAreaLimit(area, limitCount) {
    
    if(arguments.length != 2) throw "getGameEventbyAreaLimit: pass 2 arguments.";
    if(!area) throw 'getGameEventbyAreaLimit: supply area.';
    if(!limitCount) throw 'getGameEventbyAreaLimit: supply limitCount.';
    try{
        area = check.checkString(area, 'area');
        limitCount = check.checkString(limitCount, 'limitCount');
    }catch(e){
        throw 'getGameEventbyAreaLimit: ' + e.toString();
    }

    const now = new Date(Date.now());
    const gameEventCollection = await gameEvents();
    const eventList = (await gameEventCollection.find({
        area: area,
        startTime: {
            $gte: now
        },
        status: /^upcoming$/i
    }).limit(limitCount).sort({
        startTime: 1
    })).toArray();

    return eventList;
}

async function getGameEventLandingPage() {
    if(arguments.length != 0) throw 'getGameEventLandingPage: supply 0 arguments.';
    const now = new Date(Date.now());
    const gameEventCollection = await gameEvents();
    const eventList = (await gameEventCollection.find({
        startTime: {
            $gte: now
        },
        status: /^upcoming$/i
    }).limit(10).sort({
        startTime: 1
    })).toArray();

    return eventList;
}

/***
 * NEEDS TO check validity of Longitude and Latitude
 */

/*create a gameEvent and insert it into the database*/
async function create(userId, title, status, sportCategory, description, area, address,
    latitude, longitude, startTime, endTime, minimumParticipants,
    maximumParticipants) {
    if(arguments.length != 13) throw 'create: supply 13 arguments.';
    if(!userId) throw 'create: supply userId';
    if(!title) throw 'create: supply title'; 
    if(!status) throw 'create: supply status';
    if(!sportCategory) throw 'create: supply sportCategory';
    if(!description) throw 'create: supply description';
    if(!area) throw 'create: supply area';
    if(!address) throw 'create: supply address';
    if(!latitude) throw 'create: supply latitude';
    if(!longitude) throw 'create: supply longitude';
    if(!startTime) throw 'create: supply startTime';
    if(!endTime) throw 'create: supply endTime';
    if(!minimumParticipants) throw 'create: supply minimumParticipants';
    if(!maximumParticipants) throw 'create: supply maximumParticipants';
    try{
        userId = check.checkId(userId);
    title = check.checkString(title, 'title');
    status = check.checkString(status, 'status');
    sportCategory = check.checkString(sportCategory, 'sportCategory');
    description = check.checkString(description, 'description');
    area = check.checkString(area, 'area');
    address = check.checkString(address, 'address');
    startTime = check.checkDate(startTime, 'startTime');
    endTime = check.checkDate(endTime, 'endTime');
    minimumParticipants = check.checkNum(minimumParticipants, 'minimumParticipants');
    maximumParticipants = check.checkNum(maximumParticipants, 'maximumParticipants');
    // area = area.userArea;
    /* NEED to check if valid address */
    }catch(e){
        throw 'create: ' + e.toString();
    }
    
    if (!check.checkCoordinates(longitude, latitude)) {
        throw "Error: Coordinates are NOT valid"
    }

    if (!check.areValidTimes(startTime, endTime)) {
        throw "Error: EndTime must be at least 1 hour after startTime"
    }

    if (!check.validMinParticipantLimit(sportCategory, minimumParticipants)) {
        throw "Error: Minimum participation limit is not valid"
    }
    if (!check.validMaxParticipantLimit(sportCategory, maximumParticipants)) {
        throw "Error: Maximum participation limit is not valid"
    }
    if (!check.validNumParticipants(minimumParticipants, maximumParticipants)) {
        throw "Error: Minimum participants is greater than maximum participants"
    }

    if (endTime > "22:00")
    throw `No event stays after 10 pm `

    if (minimumParticipants < 2 || maximumParticipants > 30 )
    throw `Min number of participants should be 2 and maximum 30 `

    //check if the organizer has a time conflict
    let conflict;
            try{
                conflict = await userData.checkUserConflict(userId, startTime, endTime);
            }
            catch(e){
                throw e.toString();
            }

            if(conflict.conflicted){
                throw 'You are already registered for an event at this time.';
            }
    let newGameEvent = {
        userId: userId,
        title: title,
        status: status,
        sportCategory: sportCategory,
        description: description,
        area: area,
        address: address,
        latitude: latitude,
        longitude: longitude,
        startTime: startTime,
        endTime: endTime,
        minimumParticipants: minimumParticipants,
        maximumParticipants: maximumParticipants,
        currentNumberOfParticipants: 1,
        participants: [ObjectId(userId)]
    };
    let spots = maximumParticipants - minimumParticipants;
    // return spots;
    const gameEventCollection = await gameEvents();

    const insert = await gameEventCollection.insertOne(newGameEvent);
    if (!insert.acknowledged || !insert.insertedId) {
        throw "Error: Could not add gameEvent";
    }
    newGameEvent._id = insert.insertedId;
    return newGameEvent;
}
/* update game event */
async function update(gameEventId, userId, title, status, sportCategory, description) {
    try {
        gameEventId = check.checkId(gameEventId);
        userId = check.checkId(userId);
        title = check.checkString(title, 'title');
        status = check.checkString(status, 'status');
        sportCategory = check.checkString(sportCategory, 'sportCategory');
        description = check.checkString(description, 'description');
        // area = check.checkString(area, 'area');
        // address = check.checkString(address, 'address');
        // area = area.userArea;
        /* NEED to check if valid address */

        /* get maximum participants from existing event, maximum participants cannot be lowered */
        let existingEvent;
        try {
            existingEvent = await getGameEvent(gameEventId);
        } catch (e) {
            throw e.toString();
        }
        if (existingEvent.status != 'upcoming') throw 'Error: can only edit upcoming events';
    } catch (e) {
        throw e.toString();
    }
        //     throw e.toString();
        // }
        // if(existingEvent.maximumParticipants < maximumParticipants){
        //     maximumParticipants = existingEvent.maximumParticipants;
        // }

        // if (!check.checkCoordinates(longitude, latitude)) {
        //     throw "Error: Coordinates are NOT valid"
        // }

        // startTime = check.checkDate(startTime, 'startTime');
        // endTime = check.checkDate(endTime, 'endTime');

        // if (!check.areValidTimes(startTime, endTime)) {
        //     throw "Error: EndTime must be at least 1 hour after startTime"
        // }

        // minimumParticipants = check.checkNum(minimumParticipants, 'minimumParticipants');
        // if (!check.validMinParticipantLimit(sportCategory, minimumParticipants)) {
        //     throw "Error: Minimum participation limit is not valid"
        // }
        // maximumParticipants = check.checkNum(maximumParticipants, 'maximumParticipants');
        // if (!check.validMaxParticipantLimit(sportCategory, maximumParticipants)) {
        //     throw "Error: Maximum participation limit is not valid"
        // }
        // if (!check.validNumParticipants(minimumParticipants, maximumParticipants)) {
        //     throw "Error: Minimum participants is greater than maximum participants"
        // }

        // if (endTime > "22:00")
        // throw `No event stays after 10 pm `

        // if (minimumParticipants < 2 || maximumParticipants > 30 )
        // throw `Min number of Participants should be 2 and maximum 30 `

        // //check if the organizer has a time conflict
        // let conflict;
        //         try{
        //             conflict = await userData.checkUserConflict(userId, startTime, endTime);
        //         }
        //         catch(e){
        //             throw e.toString();
        //         }

        //         if(conflict.conflicted){
        //             throw 'You are already registered for an event at this time.';
        //         }
        // }
        // catch(e){
        //     throw e.toString();
        // }

        // let spots = maximumParticipants - minimumParticipants;
        // return spots;
        const gameEventCollection = await gameEvents();

        /* update document for update */
        let eventUpdate = {
            "$set": {
                "userId": userId,
                "title": title,
                "status": status,
                "sportCategory": sportCategory,
                "description": description
            }
        };

        /*filter for update */
        const filter = {
            "_id": ObjectId(gameEventId)
        };
        /* update gameEvent */
        const update = await gameEventCollection.updateOne(filter, eventUpdate);

        if (update.matchedCount !== 1 && update.modifiedCount !== 1) {
            throw "There was a problem updating the GameEvent.";
        }
        return {
            updated: true
        };
    }
async function getEventOwnerFirstName(id) {
    if(!id) throw 'getEventOwnerFirstName: pass id.';
    try{
        id = check.checkId(id);
    }
    catch(e){
        throw 'getEventOwnerFirstName: ' + e.toString();
    }
    const gameEventCollection = await gameEvents();
    const event = await gameEventCollection.findOne({
        _id: ObjectId(id)
    });
    if (event === null) throw 'No event with that id';
    const userCollection = await users();
    const user = await userCollection.findOne({
        _id: ObjectId(event.userId)
    });
    if (user == null) {
        throw "There is no a user with that Id.";
    }
    return user.firstName;
}

async function getEventOwnerLastName(id) {
    if(!id) throw 'getEventOwnerLastName: pass id.';
    try{
        id = check.checkId(id);
    }
    catch(e){
        throw 'getEventOwnerLastName: ' + e.toString();
    }
    const gameEventCollection = await gameEvents();
    const event = await gameEventCollection.findOne({
        _id: ObjectId(id)
    });
    if (event === null) throw 'No event with that id';
    const userCollection = await users();
    const user = await userCollection.findOne({
        _id: ObjectId(event.userId)
    });
    if (user == null) {
        throw "There is no a user with that Id.";
    }
    return user.lastName;
}

async function checkStatus() {
    const now = new Date(Date.now());
    const gameEventCollection = await gameEvents();
        const eventList = await gameEventCollection.find({}).toArray();
            /* $nor: [ { status: 'Finished' }, { status: 'Canceled' } ] */
    for(let i=0; i<eventList.length; i++){
        
        let event = eventList[i];
        let id = event._id;
        let status = event.status;
        let newStatus = 'same';
        let minParticipants = event.minimumParticipants;
        let curParticipants = event.currentNumberOfParticipants;
        let dayBefore = new Date(event.startTime - 86400000);
        if(status === 'upcoming'){
            if(event.startTime > now && dayBefore < now){
                if(curParticipants < minParticipants){
                 //   console.log('setting event [' + id + '] to canceled');
                    newStatus = 'canceled';
                }
            }
            if(event.endTime < now){
            //    console.log('setting event [' + id + '] to old');
                newStatus = 'old';
            }
        }
        if(newStatus != 'same'){
            let updateInfo;
            try{
                updateInfo = await gameEventCollection.updateOne({_id: id}, {$set: {status: newStatus}});
            }
            catch(e){
                throw 'checkStatus: ' + e.toString();
            }
            if (updateInfo.modifiedCount === 0) throw 'checkStatus: encountered an error updating event ' + id.toString() + ' status';
        }
    }
}



module.exports = {
    create,
    update,
    getGameEvent,
    getGameEventbyArea,
    getGameEventbyAreaLimit,
    getGameEventLandingPage,
    getGameEventbySearchArea,
    checkStatus,
    getEventOwnerFirstName,
    getEventOwnerLastName
}