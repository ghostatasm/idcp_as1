const models = require('../models');

const { AccountModel } = models.Account;

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  // force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Authenticate user and return client redirection
  return AccountModel.authenticate(username, password, (err, account) => {
    if (err) {
      return res.status(400).json({ error: 'An error ocurred trying to authenticate' });
    }

    if (!account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    // Set session account cookie
    req.session.account = AccountModel.toAPI(account);

    // Return redirect
    return res.json({ redirect: '/app' });
  });
};

const signup = (req, res) => {
  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Create user and return client redirection
  return AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new AccountModel(accountData);

    newAccount.save((err, doc) => {
      if (err) {
        console.log(err);

        if (err.code === 11000) {
          return res.status(400).json({ error: 'Username already in use. ' });
        }

        return res.status(400).json({ error: 'An error ocurred creating the account' });
      }

      // Set session account cookie
      req.session.account = AccountModel.toAPI(doc);

      // Return redirect
      return res.json({ redirect: '/app' });
    });
  });
};

module.exports = {
  logout,
  login,
  signup,
};
