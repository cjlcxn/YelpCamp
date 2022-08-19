// to append next(err) to catch any errors, and passing to next error handling middleware
const catchAsync = function (callback) {
  return function (req, res, next) {
    callback(req, res, next).catch((e) => next(e));
  };
};

module.exports = catchAsync;
