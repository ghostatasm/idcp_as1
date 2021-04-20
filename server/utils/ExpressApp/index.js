const path = require('path'); // path string utils
const express = require('express'); // server-side framework
const favicon = require('serve-favicon'); // favicon util
const compression = require('compression'); // compression of communication files
const bodyParser = require('body-parser'); // auto request body parsing
const cookieParser = require('cookie-parser'); // auto cookie parsing

const extensions = require('./extensions');

class ExpressApp {
  /**
   * Creates an Express-based server
   * @param {Function} router - function containing server routes
   * @param {Object} params - determines optional functionalities to enable
   */
  constructor(router, params) {
    this.app = express(); // create the app
    this.use = this.app.use; // enable extending the server

    // Enable middleware
    if (params.faviconPath) this.app.use(favicon(params.faviconPath)); // serve favicon
    this.app.disable('x-powered-by'); // hide server-side engine
    this.app.use(compression()); // compress communication
    this.app.use(bodyParser.urlencoded({ extended: true })); // send body parameters in request
    this.app.use(cookieParser()); // handle cookies
    if (params.hostStaticAssets) {
      const { from, to } = params.hostStaticAssets;
      this.app.use(to, express.static(path.resolve(from))); // host static assets
    }

    // Enable extensions
    if (params.extensions) {
      if (params.extensions.mongoose) {
        const { dbURL, mongooseOptions } = params.extensions.mongoose;
        extensions.mongoose.use(dbURL, mongooseOptions);
      }
      if (params.extensions.redisSession) {
        const { redisURL, secret } = params.extensions.redisSession;
        extensions.redisSession.use(this.app, redisURL, secret);
      }
      if (params.extensions.handlebars) {
        const { viewsPath } = params.extensions.handlebars;
        extensions.handlebars.use(this.app, viewsPath);
      }
      if (params.extensions.csurf) {
        // csrf must come AFTER app.use(cookieParser());
        // and app.use(session({ ....... }));
        // should come BEFORE the router
        extensions.csrf.use(this.app);
      }
    }

    router(this.app);
  }

  /**
   * Starts server and returns it
   * @param {Number} port - Port server will be running on
   */
  start(port) {
    const server = this.app.listen(port, (err) => {
      if (err) {
        throw err;
      }
      if (console) console.error(`Listening on port ${port}`);
    });

    return server;
  }
}

module.exports = ExpressApp;
