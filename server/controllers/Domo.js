const models = require('../models');

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
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  let domoPromise;
  try {
    domoPromise = newDomo.save();
  } catch (err) {
    console.log(err);
  }

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    if (err.errors.age.kind === 'min') {
      return res.status(400).json({ error: 'RAWR! Age must be a positive number' });
    }

    return res.status(400).json({ error: 'An error ocurred' });
  });

  return domoPromise;
};

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.make = makeDomo;
