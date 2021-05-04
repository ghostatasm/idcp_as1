class Message {
  constructor(username, text) {
    this.username = username;
    this.text = text;
    this.date = Date();
  }
}

module.exports = Message;
