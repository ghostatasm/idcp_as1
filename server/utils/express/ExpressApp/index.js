const path = require('path'); // path string utils
const express = require('express'); // server-side framework

const middleware = require('./middleware/middleware.js');

class ExpressApp {
  /**
   * Creates an Express-based app & server
   * @param {Function} router - function containing server routes
   * @param {Object} params - determines optional functionalities to enable
   */
  constructor(router, params) {
    this.app = express(); // create the app
    this.use = this.app.use; // public shortcut to app.use

    const { app } = this; // private shortcut to app
    app.disable('x-powered-by'); // hide server-side engine

    // Enable middleware
    app.use(middleware.compression()); // compress communication
    app.use(middleware.favicon(params.paths.favicon)); // serve favicon
    app.use(middleware.bodyParser.urlencoded({ extended: true })); // send body params in request
    app.use(middleware.cookieParser()); // handle cookies
    if (params.middleware.session) {
      if (!params.middleware.session.url) {
        throw ReferenceError('URL to connect to for session is undefined');
      }
      if (!params.middleware.session.secret) {
        throw ReferenceError('Session secret is undefined');
      }
      const { session, url, secret } = params.middleware.session;
      app.use(session(url, secret));
    }
    // csrf must come AFTER:
    // app.use(cookieParser());
    // app.use(session());
    // csrf should come BEFORE:
    // router(app)
    app.use(middleware.csrf()); // require authentication tokens
    app.use((err, req, res, next) => {
      if (err.code !== 'EBADCSRFTOKEN') return next(err);

      if (console) console.log('Missing CSRF token');
      return false;
    });

    if (params.static) {
      // Serve static files
      if (!params.static.path) {
        throw ReferenceError('Path to static files is undefined');
      }
      if (!params.static.url) {
        throw ReferenceError('URL to serve static files to is undefined');
      }
      const { url } = params.static;
      const filesPath = params.static.path;
      app.use(url, express.static(path.resolve(filesPath)));
    }

    if (params.engine) {
      // Set rendering engine

      if (params.engine.handlebars) {
        // Use handlebars as the rendering engine
        app.engine('handlebars', middleware.expressHandlebars({
          defaultLayout: 'main',
        }));
        app.set('view engine', 'handlebars');
      } else {
        // Use other rendering engine
        if (!params.engine.extension) {
          throw ReferenceError('Template engine extension is undefined');
        }

        if (!params.engine.callback) {
          throw ReferenceError('Template engine callback function is undefined');
        }

        const { extension, callback } = params.engine;

        app.engine(extension, callback);
        app.set('view engine', extension);
      }

      if (!params.engine.paths.views) {
        throw ReferenceError('Path to views files is undefined');
      }

      app.set('views', params.engine.paths.views);
    }

    // Use the router
    router(app);
  }

  /**
   * Starts server and returns it
   * @param {Number} port - Port server will be running on
   */
  start(port) {
    return this.app.listen(port, (err) => {
      if (err) {
        throw err;
      }

      if (console) console.log(`Listening on port ${port}`);
    });
  }
}

module.exports = ExpressApp;
