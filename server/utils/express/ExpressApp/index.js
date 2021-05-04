const path = require('path'); // path string utils
const express = require('express'); // server-side framework

class ExpressApp {
  /**
   * Creates an Express-based app & server
   * @param {Function} router - function containing server routes
   * @param {Object} params - determines optional functionalities to enable
   */
  constructor(router, params) {
    this.app = express(); // create the express app
    this.router = router; // set router

    // Shortcuts
    const { app } = this; // private shortcut to app
    this.use = this.app.use; // public shortcut to app.use

    app.disable('x-powered-by'); // hide server-side engine

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
  }

  /**
   * Attaches middleware to the express app
   * @param {Function} midFunction - void(app) Function with middleware attachments
   */
  middleware(midFunction) {
    midFunction(this.app);
  }

  /**
   * Sets template engine
   * @param {String} extension - name of template engine
   * @param {Function} engine - function of engine
   * @param {Object} params - options object to pass to function
   * @param {String} viewsPath - path to views files
   */
  engine(viewsPath, extension, engine, params) {
    this.app.engine(extension, engine(params));
    this.app.set('view engine', extension);
    this.app.set('views', viewsPath);
  }

  /**
   * Starts server in a port and returns it
   * @param {Number} port - Port server will be running on
   */
  start(port) {
    // Use the router
    this.router(this.app);

    return this.app.listen(port, (err) => {
      if (err) {
        throw err;
      }

      if (console) console.log(`Listening on port ${port}`);
    });
  }
}

module.exports = ExpressApp;
