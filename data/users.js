const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.user;
 const validation = require("../task/validation");
const bcrypt = require('bcrypt');
const {ObjectId} = require('mongodb');
const saltRounds = 16;

module.exports = {
  async createUser(firstName, lastName, email, street, area, lat, lon) {
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
async updateUser(firstName, lastName, email, street, area, lat, lon, id) {
  firstName = firstName.trim().toLowerCase();
  lastName = lastName.trim().toLowerCase();
  street = street.trim().toLowerCase();
  area = area.trim().toLowerCase();
  email = email.trim().toLowerCase();
  if (!validation.validString(firstName, "firstName")) throw 'Invalid first name.';
  if (!validation.validString(lastName, "lastName")) throw 'Invalid last name.';
  // if (!validation.validString(password)) throw 'Invalid password.';
  if (!validation.validString(area) || !validation.checkValidationDlArea(area) ) throw 'Invalid area.';
  if (!validation.checkEmail(email)) throw 'Invalid email.';
  if (!validation.checkCoordinates(lon,lat) || !validation.validString(street)) throw 'Invalid address';

  const userCollection = await users();
  const user = await userCollection.findOne({ email: email });
  if (user == null) {
    throw "There is no a user with that email.";
  }
  let userObj = {
    area: area,
    street: street,
    lat: lat,
    lon: lon
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

}