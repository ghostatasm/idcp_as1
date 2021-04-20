const mongoose = require('mongoose'); // mongodb models

/**
 * Helper extension to interface with Mongoose
 * @param {String} dbURL - URL to your Mongo database
 * @param {Object} mongooseOptions - Mongoose parameters object
 */
const use = (dbURL, mongooseOptions) => {
  mongoose.connect(dbURL, mongooseOptions, (err) => {
    if (err) {
      if (console) console.error('Could not connect to database');
      throw err;
    }
  });
};

module.exports = {
  use,
};
