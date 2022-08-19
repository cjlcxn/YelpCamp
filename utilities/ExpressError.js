// creates custom superclass that extends vanilla js Error class, to include extra ppt: status
class ExpressError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

module.exports = ExpressError;
