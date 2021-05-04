const router = require('./router');
const params = require('./params.json');
const middleware = require('./middleware');
const engine = require('./engine');

// Utils
const { ExpressApp } = require('../utils/express');

// Create Express App
const expressApp = new ExpressApp(router, params);
// Use middleware
expressApp.middleware(middleware);

// Set template engine
expressApp.engine('views', 'handlebars', engine, { defaultLayout: 'main' });

module.exports = expressApp;
