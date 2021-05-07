const mid = require('./middleware');
const pages = require('../../pages');
const controllers = require('../../api/controllers');

const router = (app) => {
  // Pages
  app.get('/login', mid.requiresSecure, mid.requiresLogout, pages.loginPage);
  app.get('/app', mid.requiresLogin, pages.appPage);

  // Functionalities
  app.get('/getToken', mid.requiresSecure, controllers.token.getToken);
  // Account
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.post('/resetPassword', mid.requiresSecure, mid.requiresLogin, controllers.Account.resetPassword);
  app.get('/account', mid.requiresSecure, mid.requiresLogin, controllers.Account.account);
  // GameRoom
  app.get('/rooms', mid.requiresLogin, controllers.GameRoom.rooms);
  app.get('/room', mid.requiresLogin, controllers.GameRoom.room);
  app.get('/board', mid.requiresSecure, mid.requiresLogin, controllers.GameRoom.board);
  app.post('/create', mid.requiresSecure, mid.requiresLogin, controllers.GameRoom.create);
  app.post('/join', mid.requiresSecure, mid.requiresLogin, controllers.GameRoom.join);
  app.post('/rejoin', mid.requiresSecure, mid.requiresLogin, controllers.GameRoom.rejoin);
  app.post('/leave', mid.requiresLogin, controllers.GameRoom.leave);
  app.post('/turn', mid.requiresSecure, mid.requiresLogin, controllers.GameRoom.turn);
  app.post('/surrender', mid.requiresSecure, mid.requiresLogin, controllers.GameRoom.surrender);

  // Admin
  app.get('/deleteRoom', mid.requiresSecure, controllers.GameRoom.deleteRoom);

  // Index
  app.get('/', mid.requiresSecure, mid.requiresLogout, pages.loginPage);

  // 404
  app.get('*', pages.notFoundPage);
};

module.exports = router;
