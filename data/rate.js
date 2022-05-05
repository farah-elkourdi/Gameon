const mongoCollections = require('../config/mongoCollections');
const rate = mongoCollections.rate;
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

module.exports = {
    getTopRatings
}