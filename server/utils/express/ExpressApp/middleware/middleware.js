
const favicon = require('serve-favicon'); // favicon util
const compression = require('compression'); // compression of communication files
const bodyParser = require('body-parser'); // auto request body parsing
const cookieParser = require('cookie-parser'); // auto cookie parsing
const csrf = require('csurf'); // request authentication tokens
const expressHandlebars = require('express-handlebars'); // server-side rendering

module.exports = {
  favicon,
  compression,
  bodyParser,
  cookieParser,
  csrf,
  expressHandlebars,
};
