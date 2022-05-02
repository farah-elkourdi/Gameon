const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.user;
const { ObjectId } = require('mongodb');
const validation = require('../task/validation');
const bcrypt = require('bcrypt');
const saltRounds = 16;

module.exports = {
  /* get user by id*/

  async getUser(id){
    if(arguments.length != 1){ throw "getUser : pass one argument."};
    if(!id) throw "getUser: must pass userId";
    let ID = validation.checkId(id);
    const userCollection = await users();
    const userFound = await userCollection.findOne({_id: ObjectId(ID)});
    if(userFound === null){
        throw "getUser: no user found with this id";
    }
    userFound._id = userFound._id.toString();
    return userFound;
  },


  async createUser(firstName, lastName, email, password, street, area, lat, lon) {
    firstName = firstName.trim().toLowerCase();
    lastName = lastName.trim().toLowerCase();
    street = street.trim().toLowerCase();
    area = area.trim().toLowerCase();
    email = email.trim().toLowerCase();
    if (!validation.validString(firstName, "firstName")) throw 'Invalid first name.';
    if (!validation.validString(lastName, "lastName")) throw 'Invalid last name.';
    if (!validation.validString(password)) throw 'Invalid password.';
    if (!validation.validString(area) || !validation.checkValidationDlArea(area) ) throw 'Invalid area.';
    if (!validation.checkEmail(email)) throw 'Invalid email.';
    if (!validation.checkCoordinates(lon,lat) || !validation.validString(street)) throw 'Invalid address';

    const userCollection = await users();
    const user = await userCollection.findOne({ email: email });
    if (user != null) {
      throw "There is already a user with that email.";
    }
    password = await bcrypt.hash(password, saltRounds);
    let userObj = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      area: area,
      street: street,
      lat: lat,
      lon: lon,
      avgRating: 0
    };
    if (user == null) {
    const insertedUser = await userCollection.insertOne(userObj);
    if (insertedUser.insertedCount === 0) 
    {throw 'Failed to insert'; }
    return {userInserted: true};
    }
},
async checkUser(email, password)
{
  email = email.trim().toLowerCase();
  if (!validation.validString(password)) throw 'Invalid password.';
  if (!validation.checkEmail(email)) throw 'Invalid email.';

  const userCollection = await users();
  const user = await userCollection.findOne({ email: email });
  user._id = user._id.toString();
  if (user == null)
  {throw "Either the username or password is invalid"}
  else
  {
    let result = await bcrypt.compare(password, user.password);
    if (result) return {authenticated: true, user: user};
    else
    {throw "Either the username or password is invalid"}
  }
},
//async updateUser(firstName, lastName, email, street, area, lat, lon, id) {
  async updateUser(firstName, lastName, email, id) {
  firstName = firstName.trim().toLowerCase();
  lastName = lastName.trim().toLowerCase();
  //street = street.trim().toLowerCase();
  //area = area.trim().toLowerCase();
  email = email.trim().toLowerCase();
  if (!validation.validString(firstName, "firstName")) throw 'Invalid first name.';
  if (!validation.validString(lastName, "lastName")) throw 'Invalid last name.';
  // if (!validation.validString(password)) throw 'Invalid password.';
 // if (!validation.validString(area) || !validation.checkValidationDlArea(area) ) throw 'Invalid area.';
  if (!validation.checkEmail(email)) throw 'Invalid email.';
 // if (!validation.checkCoordinates(lon,lat) || !validation.validString(street)) throw 'Invalid address';

  const userCollection = await users();
  const user = await userCollection.findOne({ email: email });
  if (user == null) {
    throw "There is no a user with that email.";
  }
  let userObj = {
    firstName: firstName,
    lastName: lastName
   // area: area,
   // street: street,
   // lat: lat,
    //lon: lon
  };
  if (user != null) {
    try{
  const updateUser = await userCollection.updateOne({_id: ObjectId(id)}, {$set: userObj});
  // if (insertedUser.insertedCount === 0) 
  // {throw 'Failed to insert'; }
  // return {userInserted: true};
  // const updatedInfo = await dogCollection.updateOne(
  //   {_id: ObjectId(id)},
  //   {$set: updatedDog}
  // );
 

  }

catch (e)
{ if (updateUser.modifiedCount === 0) {
  throw 'could not update user successfully';
}
}
  }
},

};