const mongoose = require('mongoose'); // mongodb models

const connect = (url, options) => mongoose.connect(url, options, (err) => {
  if (err) {
    if (console) console.error('Could not connect to database');
    throw err;
  }
});

module.exports = {
  connect,
};
