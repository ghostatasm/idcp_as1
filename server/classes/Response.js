class Response {
  constructor(type, message, data) {
    this.type = type;
    this.message = message;
    this.data = data;
    this.date = Date();
  }
}

module.exports = Response;
