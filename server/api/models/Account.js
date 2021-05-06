const mongoose = require('mongoose');
const crypto = require('crypto');

// Encryption constants
const iterations = 10000;
const saltLength = 64;
const keyLength = 64;

// Helper password decryption function
const validatePassword = (doc, password, callback) => {
  const pass = doc.password;

  return crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => {
    if (hash.toString('hex') !== pass) {
      return callback(false);
    }
    return callback(true);
  });
};

let AccountModel = {};
const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  salt: {
    type: Buffer,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  // Game Stats
  gamesPlayed: {
    type: Number,
    default: 0,
  },
  gamesWon: {
    type: Number,
    default: 0,
  },
  gamesTied: {
    type: Number,
    default: 0,
  },
  gamesLost: {
    type: Number,
    default: 0,
  },
});

// Returns simplified copy of account document
AccountSchema.statics.getSimplified = (doc) => ({
  // _id is built into mongo document and is guaranteed to be unique
  username: doc.username,
  _id: doc._id,
  gamesPlayed: doc.gamesPlayed,
  gamesWon: doc.gamesWon,
  gamesTied: doc.gamesTied,
  gamesLost: doc.gamesLost,
});

AccountSchema.statics.findOneByUsername = (username, callback) => {
  const search = {
    username,
  };

  return AccountModel.findOne(search, callback);
};

AccountSchema.statics.generateHash = (password, callback) => {
  const salt = crypto.randomBytes(saltLength);

  crypto.pbkdf2(password, salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => callback(salt, hash.toString('hex')));
};

AccountSchema.statics.authenticate = (username, password, callback) => {
  AccountModel.findOneByUsername(username, (err, doc) => {
    if (err) {
      return callback(err);
    }

    if (!doc) {
      return callback();
    }

    return validatePassword(doc, password, (result) => {
      if (result === true) {
        return callback(null, doc);
      }

      return callback();
    });
  });
};

AccountModel = mongoose.model('Account', AccountSchema);

module.exports = {
  AccountModel,
  AccountSchema,
};
