class Error {
  constructor(statusCode, message) {
    this.statusCode = statusCode;
    this.message = message;
    this.date = Date();
  }
}

module.exports = Error;
