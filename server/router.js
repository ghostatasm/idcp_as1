const mid = require('./middleware');
const pages = require('./pages');
const controllers = require('./controllers');

const router = (app) => {
  // Pages
  app.get('/login', mid.requiresSecure, mid.requiresLogout, pages.loginPage);
  app.get('/app', mid.requiresLogin, pages.appPage);

  // Functionalities
  app.get('/getToken', mid.requiresSecure, controllers.token.getToken); // generate csrf token for this request
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login); // handle login request
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup); // handle signup request
  app.get('/logout', mid.requiresLogin, controllers.Account.logout); // handle logout request

  // Index
  app.get('/', mid.requiresSecure, mid.requiresLogout, pages.loginPage);

  // 404
  app.get('*', pages.notFoundPage);
};

module.exports = router;
