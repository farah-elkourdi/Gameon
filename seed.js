const connection = require('./config/mongoConnection');
const data = require("./data");
const eventData = require("./data/gameEvent");
const userData = require("./userData");

const { ObjectId } = require("mongodb");


async function main(){
    const db = await connection.connectToDb();
    await db.dropDatabase();

    let user1 =  undefined;
    let user2 =  undefined;
    let user3 =  undefined;
    let user4 = undefined;

    let soccerEvent = undefined;    
    let footballEvent = undefined;
    let golfEvent = undefined;
    let baseballEvent = undefined;
    let basketballEvent = undefined;

    try{
        user1 = await userData.createUser(
            "John",
            "Doe",
            "johndoe@gmail.com",
            "john@123",
            "washington St",
            "hoboken",
            "40.7365224",
            "-74.0311785"
        );
        console.log(user1);
    } catch (e){
        console.log(e);
    }
    
    try{
        user2 = await userData.createUser(
            "Harsh",
            "Singhania",
            "harshs@gmail.com",
            "harsh@123",
            "cambridge avenue",
            "jersey city",
            "40.7457215",
            "-74.0482442"
        );
        console.log(user2);
    } catch (e){
        console.log(e);
    }

    // try{
    //     user3 = await userData.createUser(
    //         "Avinash",
    //         "Kumar",
    //         "avinashk@gmail.com",
    //         "avinash@123",
    //         "6th Street",
    //         "Hoboken",
    //         "40",
    //         "-70"
    //     );
    //     console.log(user2);
    // } catch (e){
    //     console.log(e);
    // }

    try{
        soccerEvent = await eventData.create(
            user1._id,
            "Soccer 5v5 event",
            "Upcoming",
            "soccer",
            "Playing 5v5 soccer. Need more players to complete a team",
            "hoboken",
            "Sinatra Park",
            "40.7411793",
            "-74.02634826593933",
            "2022-09-07T15:00:00.000+00:00",
            "2022-09-07T17:00:00.000+00:00",
            10,
            14
        );
        console.log(soccerEvent);
    }catch(e){
        console.log(e);
    }

    try{
        basketballEvent = await eventData.create(
            user2._id,
            "Basketball 4v4 event",
            "upcoming",
            "basketball",
            "Playing basketball somewhere in jersey city.",
            "jersey city",
            "washington park",
            "40.75325425",
            "-74.0425694972658",
            "2022-10-08T18:00:00.000+00:00",
            "2022-10-08T19:00:00.000+00:00",
            8,
            12
        );
        console.log(soccerEvent);
    }catch(e){
        console.log(e);
    }















    await connection.closeConnection();
}




main();