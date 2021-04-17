const csrf = require('csurf'); // request authentication tokens

/**
 * Attach Csurf token middleware to server app
 * @param {Object} app - Express sever app to attach this middleware to
 */
const use = (app) => {
  app.use(csrf());
  app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);

    if (console) console.log('Missing CSRF token');
    return false;
  });
};

module.exports = {
  use,
};
