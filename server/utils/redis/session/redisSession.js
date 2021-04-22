const url = require('url'); // url utils
const expressSession = require('express-session'); // login session util
const redis = require('redis'); // redis database
const RedisStore = require('connect-redis')(expressSession); // redis database store

/**
 * Returns Redis session middleware for express app
 * @param {String} redisURL - Redis database connection string
 * @param {String} secret - Secret string for encryption
 */
const session = (redisURL, secret) => {
  const urlData = url.parse(redisURL);

  const redisClient = redis.createClient({
    host: urlData.hostname,
    port: urlData.port,
    password: urlData.auth.split(':')[1],
  });

  return expressSession({
    key: 'sessionid',
    store: new RedisStore({
      client: redisClient,
    }),
    secret,
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
    },
  });
};

module.exports = session;
