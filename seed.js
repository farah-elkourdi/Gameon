const dbConnection = require('./config/mongoConnection');
const data = require("./data");
const eventData = require("./data/gameEvent");
const userData = require("./data/users");
const commentData = require("./data/comments");
const rateData = require("./data/rate");

const {
    ObjectId
} = require("mongodb");


async function main() {
    const db = await dbConnection();
    await db.dropDatabase();

    let u2 = undefined;
    let u3 = undefined;

    let frisbeeEvent = undefined;
    let basketballEvent = undefined;

    let comment1 = undefined;
    let comment2 = undefined;
    let comment3 = undefined;

    let rating1 = undefined;
    let rating2 = undefined;
    let rating3 = undefined;

    //Adding Users
    let u1 = await userData.createUserSeed(
        "John",
        "Doe",
        "johndoe@gmail.com",
        "john@123",
        "washington St",
        "hoboken",
        "40.7365224",
        "-74.0311785"
    );
    //console.log(u1);

    u2 = await userData.createUserSeed(
        "Harsh",
        "Singhania",
        "harshs@gmail.com",
        "harsh@123",
        "cambridge avenue",
        "jersey city",
        "40.7457215",
        "-74.0482442"
    );
    //console.log(u2);

    u3 = await userData.createUserSeed(
        "avinash",
        "kumar",
        "avinashk@gmail.com",
        "avinash@123",
        "bowers street",
        "jersey city",
        "40.7482695",
        "-74.0509703"
    );
    //console.log(u3);


    //Creating Event
    let soccerEvent = await eventData.create(
        u1._id.toString(),
        "Soccer 5v5 event",
        "upcoming",
        "soccer",
        "Playing 5v5 soccer. Need more players to complete a team",
        "hoboken",
        "Sinatra Park",
        "40.7411793",
        "-74.02634826593933",
        new Date("2022-09-07T15:00:00.000+00:00"),
        new Date("2022-09-07T17:00:00.000+00:00"),
        10,
        14
    );
    //console.log(soccerEvent);

    basketballEvent = await eventData.create(
        u2._id.toString(),
        "Basketball 4v4 event",
        "upcoming",
        "basketball",
        "Playing basketball somewhere in jersey city.",
        "jersey city",
        "washington park",
        "40.75325425",
        "-74.0425694972658",
        new Date("2022-10-08T18:00:00.000+00:00"),
        new Date("2022-10-08T19:00:00.000+00:00"),
        8,
        12
    );
    //console.log(basketballEvent);

    frisbeeEvent = await eventData.create(
        u3._id.toString(),
        "Frisbee event",
        "upcoming",
        "frisbee",
        "playing frisbee in jersey city",
        "jersey city",
        "Pershing Field",
        "40.742262",
        "-74.05347075926747",
        new Date("2022-08-10T20:00:00.000+00:00"),
        new Date("2022-08-10T22:00:00.000+00:00"),
        4,
        8
    );
    //console.log(frisbeeEvent);


    //Adding comments 
    comment1 = await commentData.postComment(
        u1._id.toString(),
        soccerEvent._id.toString(),
        "Looking forward to play soccer with everyone!",
        new Date("2022-05-08T17:30:25.363+00:00"),
        "johndoe@gmail.com"
    );
    //console.log(comment1);

    comment2 = await commentData.postComment(
        u2._id.toString(),
        basketballEvent._id.toString(),
        "Can't wait to play basketball!",
        new Date("2022-05-08T17:40:25.363+00:00"),
        "harshs@gmail.com"
    );
    //console.log(comment2);

    comment3 = await commentData.postComment(
        u3._id.toString(),
        frisbeeEvent._id.toString(),
        "Does anyone have an extra frisbee disc? If yes, please carry it with you.",
        new Date("2022-05-08T18:30:25.363+00:00"),
        "avinashk@gmail.com"
    );
    //console.log(comment3);


    //Added Rating 
    rating1 = await rateData.rating(
        "avinashk@gmail.com",
        basketballEvent._id.toString(),
        u3._id.toString(),
        5,
        basketballEvent.userId
    );
    //console.log(rating1);

    rating2 = await rateData.rating(
        "harshs@gmail.com",
        frisbeeEvent._id.toString(),
        u2._id.toString(),
        4,
        frisbeeEvent.userId
    );
    //console.log(rating1);


    console.log('Done seeding database');
    // await dbConnection().close();
}


main();