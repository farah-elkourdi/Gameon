const express = require('express')
const app = express();
const static = express.static(__dirname + '/public');
const session = require('express-session');
const configRoutes = require('./routes');
const cookieParser = require("cookie-parser");
const exphbs = require('express-handlebars');
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

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});