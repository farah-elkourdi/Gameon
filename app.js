const express = require('express')
const app = express();
const static = express.static(__dirname + '/public');
const session = require('express-session');
const configRoutes = require('./routes');
const cookieParser = require("cookie-parser");
const exphbs = require('express-handlebars');
const gameEvent = require('./data/gameEvent');
require('dotenv').config();


app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(
  session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: true  
  })
);

configRoutes(app);

/* updating the status of events */
async function check(){
  try{
    await gameEvent.checkStatus();
  }catch(e){
    console.log(e.toString());
  }
};

check();

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});


