const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.user;
 const validation = require("../task/validation");
const bcrypt = require('bcrypt');
const saltRounds = 16;

module.exports = {
  async createUser(firstName, lastName, email, password, street, area, lat, lon) {
    firstName = firstName.trim().toLowerCase();
    lastName = lastName.trim().toLowerCase();
    street = street.trim().toLowerCase();
    area = area.trim().toLowerCase();
    email = email.trim().toLowerCase();
    if (!validation.validString(firstName, "firstName")) throw 'Invalid first name.';
    if (!validation.validString(lastName, "lastName")) throw 'Invalid last name.';
    if (!validation.validString(password)) throw 'Invalid password.';
    if (!validation.validString(area)) throw 'Invalid area.';
    if (!validation.chackEmail(email)) throw 'Invalid email.';
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
  if (!validation.chackEmail(email)) throw 'Invalid email.';

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


}