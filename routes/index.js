const landingPageApi = require('./landingPageApi');
const userEvents = require('./userEvents');
const createGameEvent = require('./createGameEvent');
const user = require('./users');

const constructorMethod = (app) => {
  app.use('/user', user);
  app.use('/userEvents', userEvents)
  app.use('/createGameEvent', createGameEvent)
  app.use('/', landingPageApi);
};

module.exports = constructorMethod;