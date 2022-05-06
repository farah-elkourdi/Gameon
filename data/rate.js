const mongoCollections = require('../config/mongoCollections');
//const userData = require('../data/users');
const validation = require("../task/validation");
const rate = mongoCollections.rate;
const users = mongoCollections.user;
const {
    ObjectId
} = require('mongodb');
const userData = require('./users');

/* Given top 5 organizers rating */
async function getTopRatings() {
    const rateCollection = await rate();
    const avgRatingList = await rateCollection.aggregate([        
        {
            $group: {_id: "$organizerId", avgRating: { $avg: "$rating" } }
        },
        { $sort: { "avgRating": -1 } },
        {$limit: 5}
    ]).toArray();

    for (let i = 0; i < avgRatingList.length; i++) {
        let id = avgRatingList[i]._id.toString();
        let user;
        try {
            user = await userData.getUser(id);
        }
        catch {
            user = null;
        }
        
        let name = 'Default User';
        if (user) {
            name = user.firstName + ' ' + user.lastName;
        }
        avgRatingList[i].name = name;
        avgRatingList[i]._id = id;
    }

    return avgRatingList;
}

async function rating(email, gameId, userId, rating) {
    let nerRating = 0
   let user =  await userData.getUserByEmail(email);
   if(!email) throw "getUser: must pass email";
   if(!gameId) throw "getUser: must pass gameid";
   if(!userId) throw "getUser: must pass userId";
   if (!validation.checkEmail(email)) throw 'Invalid email.';
   if (!validation.checkId(gameId)) throw 'Invalid gameId.';
   if (!validation.checkId(userId)) throw 'Invalid userId.';
   if(!rating) throw 'Invalid not an integer.';
   if(! validation.validinteger(rating)) throw 'Invalid not an integer.';
   const rateCollection = await rate();
let rateUser = 
{
    userId: userId,
    gameEventId: gameId,
    organizerId: user._id.toString(),
    rating: Number(rating)
}
   const insertedrate = await rateCollection.insertOne(rateUser);
   if (insertedrate.insertedCount === 0) 
   {throw 'Failed to insert'; }

   let size = 1

 let newsize =   (await rateCollection.find({
    gameEventId: gameId,
}).toArray().length);

if(newsize)
{
    nerRating = user.avgRating + (( Number(rating) - user.avgRating) / size );
}
else
{
    nerRating = user.avgRating + (( Number(rating) - user.avgRating) / ( size + 1 ));
}

if (nerRating > 5)
{nerRating = 5}

   let userObj = {
    avgRating: nerRating
  };

//   if( await checkparticipant(gameId, userId) > 0)
//   {
//     throw 'this ID not related to that game.';
//   }

const userCollection = await users();
    var updateUser = await userCollection.updateOne({_id: ObjectId(user._id.toString())}, {$set: userObj})
 
    if (updateUser.modifiedCount === 0) {
      throw 'could not update user successfully';
    }
    
      }

    //   async function  checkparticipant(id, participantid)
    //   {
    //    var count =  db.gameEvent
    //     .find({
    //       _id: ObjectId(id.toString()),
    //       participants: { $in: [participantid] },
    //     })
    //     .count();
    //     return count;
    //   }

module.exports = {
    getTopRatings,
    rating,
}