const models = require('../server/models');

const {  } = models;

const makerPage = (req, res) => {
  .Model.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error ocurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), s: docs });
  });
};

const gets = (req, res) => .Model.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error ocurred' });
  }

  return res.json({ s: docs });
});

const make = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.size) {
    return res.status(400).json({ error: 'RAWR! Name, age, and size are required' });
  }

  const Data = {
    name: req.body.name,
    age: req.body.age,
    size: req.body.size,
    owner: req.session.account._id,
  };

  const new = new .Model(Data);
  const Promise = new.save((err) => {
    if (err) {
      console.log(err);

      if (err.errors.age && err.errors.age.kind === 'min') {
        return res.status(400).json({ error: 'RAWR! Age must be a positive number' });
      }

      if (err.errors.size && err.errors.size.kind === 'min') {
        return res.status(400).json({ error: 'RAWR! Size must be a positive number' });
      }

      return res.status(400).json({ error: 'An error ocurred' });
    }

    return res.json({ redirect: '/maker' });
  });

  return Promise;
};

const delete = (req, res) => {
  if (!req.query.id) {
    return res.status(400).json({ error: 'RAWR! id required' });
  }

  return .Model.deleteById(req.query.id, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error ocurred' });
    }

    return res.json({ message: 'RAWR!  deleted' });
  });
};

module.exports.makerPage = makerPage;
module.exports.gets = gets;
module.exports.make = make;
module.exports.delete = delete;
