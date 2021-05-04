const app = require('./app'); // Import express app
const sockets = require('./sockets/index.js'); // Import sockets

// Utils
const mongooseUtils = require('./utils/mongoose');

// Setup environment variables
const port = process.env.PORT || process.env.NODE_PORT || 3000;
const mongoURL = process.env.MONGODB_URI || 'mongodb://localhost/ultimateTTT';

// Connect to MongoDB
mongooseUtils.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Start and cache the server
const server = app.start(port);

// Start WebSockets (can cache socket.io from return value)
sockets(server);
