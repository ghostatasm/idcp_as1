const mid = require('./middleware');
const pages = require('./pages');
const controllers = require('./controllers');

const router = (app) => {
  // Pages
  app.get('/login', mid.requiresSecure, mid.requiresLogout, pages.loginPage);
  app.get('/app', mid.requiresLogin, pages.appPage);

  // Functionalities
  app.get('/getToken', mid.requiresSecure, controllers.token.getToken); // generate csrf token for this request
  // Account
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login); // handle login request
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup); // handle signup request
  app.get('/logout', mid.requiresLogin, controllers.Account.logout); // handle logout request
  app.put('/resetPassword', mid.requiresSecure, mid.requiresLogin, controllers.Account.resetPassword);
  app.get('/account', mid.requiresSecure, mid.requiresLogin, controllers.Account.account); // send account info
  // GameRoom
  app.get('/rooms', mid.requiresLogin, controllers.GameRoom.rooms); // handle rooms request
  app.post('/create', mid.requiresSecure, mid.requiresLogin, controllers.GameRoom.create); // handle room create request
  app.post('/join', mid.requiresSecure, mid.requiresLogin, controllers.GameRoom.join); // handle room join request
  app.post('/leave', mid.requiresSecure, mid.requiresLogin, controllers.GameRoom.leave); // handle room leave request
  app.post('/turn', mid.requiresSecure, mid.requiresLogin, controllers.GameRoom.turn); // handle turn request

  // Index
  app.get('/', mid.requiresSecure, mid.requiresLogout, pages.loginPage);

  // 404
  app.get('*', pages.notFoundPage);
};

module.exports = router;
