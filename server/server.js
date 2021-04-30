const serverParams = require('./serverParams.json'); // Import server parameters
const router = require('./router.js'); // Import routes
const sockets = require('./sockets.js'); // Import sockets

// Utils
const expressUtils = require('./utils/express');
const mongooseUtils = require('./utils/mongoose');
const redisUtils = require('./utils/redis');

const { ExpressApp } = expressUtils;

// Setup environment variables
const port = process.env.PORT || process.env.NODE_PORT || 3000;
const mongoURL = process.env.MONGODB_URI || 'mongodb://localhost/ultimateTTT';
const redisURL = process.env.REDISCLOUD_URL || serverParams.middleware.session.url;

// Update server parameters
serverParams.middleware.session.url = redisURL;
serverParams.middleware.session.session = redisUtils.session;

// Create Express App
const expressApp = new ExpressApp(router, serverParams);

// Connect to MongoDB
mongooseUtils.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Start and cache the server
const server = expressApp.start(port);

// Start WebSockets (can cache socket.io from return value)
sockets(server);
