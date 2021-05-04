// Dependencies
const favicon = require('serve-favicon'); // favicon util
const compression = require('compression'); // compression of communication files
const bodyParser = require('body-parser'); // auto request body parsing
const cookieParser = require('cookie-parser'); // auto cookie parsing
const csrf = require('csurf'); // request authentication tokens

// Utils
const redisUtils = require('../../utils/redis');

const { session } = redisUtils;

// Constants
const FAVICON_PATH = './hosted/img/favicon.png';

const SESSION_PARAMS = {
  url: process.env.REDISCLOUD_URL || 'redis://default:VqhSFRgtfKFR712ux95bxaGxrT9qstOr@redis-16099.c261.us-east-1-4.ec2.cloud.redislabs.com:16099',
  secret: 'Trouble in Tic Tac Toe Town',
};

/**
 * Attach middleware to the express app
 * @param {Object} app
 */
const use = (app) => {
  app.use(compression()); // compress communication
  app.use(favicon(FAVICON_PATH)); // serve favicon
  app.use(bodyParser.urlencoded({ extended: true })); // send body params in request
  app.use(cookieParser()); // handle cookies
  app.use(session(SESSION_PARAMS.url, SESSION_PARAMS.secret));
  // csrf must come AFTER:
  // app.use(cookieParser());
  // app.use(session());
  // csrf should come BEFORE:
  // router(app)
  app.use(csrf()); // require authentication tokens
  app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);

    if (console) console.log('Missing CSRF token');
    return false;
  });
};

module.exports = use;
