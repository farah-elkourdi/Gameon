const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.user;
const gameEvents = mongoCollections.gameEvent;
const {
  ObjectId
} = require('mongodb');
const validation = require('../task/validation');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-handlebars');
require('dotenv').config();
const contactUs = require('../data/contactus');
const saltRounds = 16;

function getRandomString(length) {
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
}

module.exports = {
  /* get user by id*/

  async getUser(id) {
    if (arguments.length != 1) {
      throw "getUser : pass one argument."
    };
    if (!id) throw "getUser: must pass userId";
    let ID = validation.checkId(id);
    const userCollection = await users();
    const userFound = await userCollection.findOne({
      _id: ObjectId(ID)
    });
    if (userFound === null) {
      throw "getUser: no user found with this id";
    }
    userFound._id = userFound._id.toString();
    return userFound;
  },

  async createUserSeed(firstName, lastName, email, password, street, area, lat, lon) {
    firstName = firstName.trim().toLowerCase();
    lastName = lastName.trim().toLowerCase();
    street = street.trim().toLowerCase();
    area = area.trim().toLowerCase();
    email = email.trim().toLowerCase();
    if (!validation.validString(firstName, "firstName")) throw 'Invalid first name.';
    if (!validation.validString(lastName, "lastName")) throw 'Invalid last name.';
    if (!validation.validString(password)) throw 'Invalid password.';
    if (!validation.validString(area) || !validation.checkValidationDlArea(area)) throw 'Invalid area.';
    if (!validation.checkEmail(email)) throw 'Invalid email.';
    if (!validation.checkCoordinates(lon, lat) || !validation.validString(street)) throw 'Invalid address';

    const userCollection = await users();
    const user = await userCollection.findOne({
      email: email
    });
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
      if (insertedUser.insertedCount === 0) {
        throw 'Failed to insert';
      }
      const user = await userCollection.findOne({
        email: email
      });
      return user;
    }    
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
    if (!validation.validString(area) || !validation.checkValidationDlArea(area)) throw 'Invalid area.';
    if (!validation.checkEmail(email)) throw 'Invalid email.';
    if (!validation.checkCoordinates(lon, lat) || !validation.validString(street)) throw 'Invalid address';

    const userCollection = await users();
    const user = await userCollection.findOne({
      email: email
    });
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
      if (insertedUser.insertedCount === 0) {
        throw 'Failed to insert';
      }
      return {
        userInserted: true
      };
    }
  },
  async checkUser(email, password) {
    email = email.trim().toLowerCase();
    if (!validation.validString(password)) throw 'Invalid password.';
    if (!validation.checkEmail(email)) throw 'Invalid email.';

    const userCollection = await users();
    const user = await userCollection.findOne({
      email: email
    });
    user._id = user._id.toString();
    if (user == null) {
      throw "Either the username or password is invalid"
    } else {
      let result = await bcrypt.compare(password, user.password);
      if (result) return {
        authenticated: true,
        user: user
      };
      else {
        throw "Either the username or password is invalid"
      }
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
    const user = await userCollection.findOne({
      email: email
    });
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
      try {
        const updateUser = await userCollection.updateOne({
          _id: ObjectId(id)
        }, {
          $set: userObj
        });
        // if (insertedUser.insertedCount === 0) 
        // {throw 'Failed to insert'; }
        // return {userInserted: true};
        // const updatedInfo = await dogCollection.updateOne(
        //   {_id: ObjectId(id)},
        //   {$set: updatedDog}
        // );


      } catch (e) {
        if (updateUser.modifiedCount === 0) {
          throw 'could not update user successfully';
        }
      }
    }
  },


  async updatePass(pass, email) {
    if (!validation.validString(pass)) throw 'Invalid password.';
    password = await bcrypt.hash(pass, saltRounds);
    const userCollection = await users();
    const user = await userCollection.findOne({
      email: email
    });
    if (user == null) {
      throw "There is no a user with that email.";
    }

    let userObj = {
      password: password
    };

    if (user != null) {
      try {
        let id = user._id
        var updateUser = await userCollection.updateOne({
          _id: ObjectId(id)
        }, {
          $set: userObj
        });
      } catch (e) {
        if (updateUser.modifiedCount === 0) {
          throw 'could not update user successfully';
        }
      }
    }
  },



  async forgetPass(email) {
    if (!validation.checkEmail(email)) throw 'Invalid password or email.';
    const userCollection = await users();
    email = email.trim().toLowerCase();
    const user = await userCollection.findOne({
      email: email
    });
    if (user == null) {
      throw "There is no a user with that email.";
    }
    var temppass = getRandomString(8)
    password = await bcrypt.hash(temppass, saltRounds);
    let userObj = {
      password: password
    };

    if (user != null) {

      try {
        let id = user._id
        var updateUser = await userCollection.updateOne({
          _id: ObjectId(id)
        }, {
          $set: userObj
        });
      } catch (e) {
        if (updateUser.modifiedCount === 0) {
          throw 'could not update user successfully';
        }
      }
      await contactUs.emailSetuppass(email, temppass, user.firstName);
    }
  },

  /* get user by Email*/

  async getUserByEmail(email) {
    if (arguments.length != 1) {
      throw "getUser : pass one argument."
    };
    if (!email) throw "getUser: must pass userId";
    if (!validation.checkEmail(email)) throw "Invalid email"
    const userCollection = await users();
    const userFound = await userCollection.findOne({
      email: email
    });
    if (userFound === null) {
      throw "getUser: no user found with this id";
    }
    userFound._id = userFound._id.toString();
    return userFound;
  },

  async checkUserConflict(userId, startTime, endTime) {

    /* checking inputs */
    if (arguments.length != 3) {
      throw "checkUserConflict : pass three arguments."
    };
    if (!userId) throw 'checkUserConflict : supply UserId';
    if (!startTime) throw 'checkUserConflict : supply start time.';
    if (!endTime) throw 'checkUserConflict : supply end time.';
    try {
      userId = validation.checkId(userId);
      startTime = validation.checkDate(startTime, 'start time');
      endTime = validation.checkDate(endTime, 'end time');
    } catch (e) {
      throw e.toString();
    }
    if (endTime <= startTime) throw 'checkUserConflict: end time must be after start time!';
    const gameEventCollection = await gameEvents();
    const eventList = await gameEventCollection.find({
      participants: {
        $in: [ObjectId(userId)]
      },
      status: 'upcoming'
    }).toArray();
    let conflict = false;
    for (let i = 0; i < eventList.length; i++) {
      let eStart = eventList[i].startTime;
      let eEnd = eventList[i].endTime;
      let b = !((startTime < eStart && endTime <= eStart) || (startTime >= eEnd && endTime > eEnd));
      /* console.log(b); */
      if (b) {
        conflict = true;
        break;
      }
    }
    return {
      conflicted: conflict
    };
  }


};