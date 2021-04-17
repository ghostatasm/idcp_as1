const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const appPage = (req, res) => {
  res.render('app', {});
};

const notFoundPage = (req, res) => {
  res.status(404).render('notFound');
};

module.exports = {
  loginPage,
  appPage,
  notFoundPage,
};
