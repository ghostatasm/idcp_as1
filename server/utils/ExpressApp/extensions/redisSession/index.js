const url = require('url'); // url utils
const session = require('express-session'); // login session util
const redis = require('redis'); // redis database
const RedisStore = require('connect-redis')(session); // redis database store

/**
 * Attach Redis session middleware to server app
 * @param {Object} app - Express sever app to attach this middleware to
 * @param {String} redisURL - Redis connection URL string
 * @param {String} secret - Secret string for the session (encryption)
 */
const use = (app, redisURL, secret) => {
  const urlData = url.parse(redisURL);

  const redisClient = redis.createClient({
    host: urlData.hostname,
    port: urlData.port,
    password: urlData.auth.split(':')[1],
  });

  app.use(session({
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
  }));
};

module.exports = {
  use,
};
