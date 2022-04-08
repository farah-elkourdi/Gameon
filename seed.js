const connection = require('./config/mongoConnection');
const data = require("./data");


async function main(){
    const db = await connection.connectToDb();
    await db.dropDatabase();

    let sarah =  undefined;
    let john =  undefined;
    let alex =  undefined;
    let maria = undefined;

    let soccerEvent = undefined;    
    let footballEvent = undefined;
    let golfEvent = undefined;
    let baseballEvent = undefined;
    let basketballEvent = undefined;

    try{
        soccerEvent = await data.gameEvent.create();
        console.log(soccerEvent);
    } catch (e){
        console.log(e);
    }
    
    await connection.closeConnection();
}




main();