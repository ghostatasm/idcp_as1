const { v4: uuid } = require('uuid');


class Message {
  constructor(username, text) {
    this.username = username;
    this.text = text;
    this.date = Date();
    this.id = uuid();
  }
}

module.exports = Message;
