const landingPageApi = require('./landingPageApi');
const userEvents = require('./userEvents');
const createGameEvent = require('./createGameEvent');
const updateGameEvent = require('./updateGameEvent');
const viewGameEvent = require('./viewGameEvent');
const user = require('./users');
const contactus = require('./contactus');
const comments =  require('./comments');
const eventListApi = require('./eventListApi');
const rate = require('./rate');

const constructorMethod = (app) => {
  app.use('/user', user);
  app.use('/contactus', contactus);
  app.use('/userEvents', userEvents)
  app.use('/viewGameEvent', viewGameEvent)
  app.use('/comments', comments);
  app.use('/createGameEvent', createGameEvent);
  app.use('/updateGameEvent', updateGameEvent);
  app.use('/eventList', eventListApi);
  app.use('/rate', rate);
  app.use('/', landingPageApi);
};

module.exports = constructorMethod;