const models = require('../server/models');

const { Domo } = models;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error ocurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const getDomos = (req, res) => Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error ocurred' });
  }

  return res.json({ domos: docs });
});

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.size) {
    return res.status(400).json({ error: 'RAWR! Name, age, and size are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    size: req.body.size,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);
  const domoPromise = newDomo.save((err) => {
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

  return domoPromise;
};

const deleteDomo = (req, res) => {
  if (!req.query.id) {
    return res.status(400).json({ error: 'RAWR! id required' });
  }

  return Domo.DomoModel.deleteById(req.query.id, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error ocurred' });
    }

    return res.json({ message: 'RAWR! Domo deleted' });
  });
};

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.make = makeDomo;
module.exports.deleteDomo = deleteDomo;
