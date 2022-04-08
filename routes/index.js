const landingPageApi = require('./landingPageApi');
const userEvents = require('./userEvents');
const createGameEvent = require('./createGameEvent');

const constructorMethod = (app) => {
  app.use('/userEvents', userEvents)
  app.use('/createGameEvent', createGameEvent)
  app.use('/', landingPageApi);
};

module.exports = constructorMethod;