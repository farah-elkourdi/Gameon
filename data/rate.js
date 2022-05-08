const mongoCollections = require('../config/mongoCollections');
const validation = require("../task/validation");
const rate = mongoCollections.rate;
const users = mongoCollections.user;
const {
    ObjectId
} = require('mongodb');
const userData = require('../data/users');

/* Given top 5 organizers rating */
async function getTopRatings() {
    const userCollection = await users();
    const avgRatingList = await userCollection.aggregate([{
            $match: {
                avgRating: {
                    $gt: 0
                }
            }
        },
        {
            $sort: {
                "avgRating": -1
            }
        },
        {
            $limit: 5
        }
    ]).toArray();

    for (let i = 0; i < avgRatingList.length; i++) {
        let name = avgRatingList[i].firstName + ' ' + avgRatingList[i].lastName;
        avgRatingList[i].name = name;
        avgRatingList[i]._id = avgRatingList[i]._id.toString();
    }

    return avgRatingList;
}

async function rating(email, gameId, userId, rating, organizerID) {
    let nerRating = 0
    let user = await userData.getUser(organizerID);
    if (!email) throw "getUser: must pass email";
    if (!gameId) throw "getUser: must pass gameid";
    if (!userId) throw "getUser: must pass userId";
    if (!validation.checkEmail(email)) throw 'Invalid email.';
    if (!validation.checkId(gameId)) throw 'Invalid gameId.';
    if (!validation.checkId(userId)) throw 'Invalid userId.';
    if (!rating) throw 'Invalid not an integer.';
    if (!validation.validinteger(rating)) throw 'Invalid not an integer.';
    const rateCollection = await rate();

    let newsize = await rateCollection.find({
        organizerId: organizerID,
    }).toArray()

    let rateUser = {
        userId: userId,
        gameEventId: gameId,
        organizerId: organizerID,
        rating: Number(rating)
    }
    const insertedrate = await rateCollection.insertOne(rateUser);
    if (insertedrate.insertedCount === 0) {
        throw 'Failed to insert';
    }

    let size = 1

    if (newsize.length > 0) {
        nerRating = user.avgRating + ((Number(rating) - user.avgRating) / (newsize.length + 1));
    } else {
        nerRating = user.avgRating + ((Number(rating) - user.avgRating) / (size));
    }

    if (nerRating > 5) {
        nerRating = 5
    }

    let userObj = {
        avgRating: nerRating
    };

    //   if( await checkparticipant(gameId, userId) > 0)
    //   {
    //     throw 'this ID not related to that game.';
    //   }

    const userCollection = await users();
    var updateUser = await userCollection.updateOne({
        _id: ObjectId(organizerID.toString())
    }, {
        $set: userObj
    })

    if (updateUser.modifiedCount === 0) {
        if (updateUser.matchedCount === 0) {
            throw 'could not update user successfully';

        }
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