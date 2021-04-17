
const serverParams = require('./serverParams.json'); // Import server parameters
const router = require('./router.js'); // Import routes
const ExpressServer = require('./utils/ExpressSever'); // Helper express server maker class

// Setup environment variables
const port = process.env.PORT || process.env.NODE_PORT || 3000;
const dbURL = process.env.MONGODB_URI || serverParams.extensions.mongoose.dbURL;
const redisURL = process.env.REDISCLOUD_URL || serverParams.extensions.redisSession.redisURL;

// Update server parameters
serverParams.extensions.mongoose.dbURL = dbURL;
serverParams.extensions.redisSession.redisURL = redisURL;

const server = new ExpressServer(router, serverParams); // Create Express server
server.listen(port); // Start server
