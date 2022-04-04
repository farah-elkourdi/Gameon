const landingPageApi = require('./landingPageApi');

const constructorMethod = (app) => {
  app.use('/', landingPageApi);
};

module.exports = constructorMethod;