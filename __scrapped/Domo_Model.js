const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let Model = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertID = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  size: {
    type: Number,
    min: 0,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

Schema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  size: doc.size,
});

Schema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertID(ownerId),
  };

  return Model.find(search).select('name age size').lean().exec(callback);
};

Schema.statics.findById = (id, callback) => {
  const search = {
    _id: convertID(id),
  };

  return Model.find(search).lean().exec(callback);
};

Schema.statics.deleteById = (id, callback) => {
  const search = {
    _id: convertID(id),
  };

  return Model.deleteOne(search).exec(callback);
};

Model = mongoose.model('', Schema);

module.exports.Model = Model;
module.exports.Schema = Schema;
