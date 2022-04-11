const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.user;
const { ObjectId } = require('mongodb');
const check = require('../task/validation');

/* get user by id*/

async function getUser(id){
    if(arguments.length != 1){ throw "getUser : pass one argument."};
    if(!eventId) throw "getUser: must pass userId";
    let ID = check.checkId(id);
    const userCollection = await users();
    const userFound = await userCollection.findOne({_id: ObjectId(ID)});
    if(userFound === null){
        throw "getUser: no user found with this id";
    }
    userFound._id = userFound._id.toString();
    return userFound;
}

module.exports = {
    getUser
}