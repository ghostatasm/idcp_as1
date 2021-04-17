const expressHandlebars = require('express-handlebars'); // server-side rendering

/**
 * Attach Handlebars rendering to server app
 * @param {Object} app - Express sever app to attach set this rendering engine to
 * @param {String} viewsPath - Path to views folder
 */
const use = (app, viewsPath) => {
  app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
  app.set('view engine', 'handlebars');
  app.set('views', viewsPath);
};

module.exports = {
  use,
};
