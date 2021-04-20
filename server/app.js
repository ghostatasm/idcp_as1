const serverParams = require('./serverParams.json'); // Import server parameters
const router = require('./router.js'); // Import routes
const ExpressApp = require('./utils/ExpressApp'); // Helper express server maker class
const sockets = require('./sockets.js');

// Setup environment variables
const port = process.env.PORT || process.env.NODE_PORT || 3000;
const dbURL = process.env.MONGODB_URI || serverParams.extensions.mongoose.dbURL;
const redisURL = process.env.REDISCLOUD_URL || serverParams.extensions.redisSession.redisURL;

// Update server parameters
serverParams.extensions.mongoose.dbURL = dbURL;
serverParams.extensions.redisSession.redisURL = redisURL;

// Start Server and WebSockets
const app = new ExpressApp(router, serverParams); // Create Express server
const server = app.start(port); // Start and get the server
sockets.start(server); // Start WebSockets (can cache socket from return value)
