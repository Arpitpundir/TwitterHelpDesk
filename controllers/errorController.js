const AppError = require("./../utils/AppError");

const devModeErrorResponse = (req, res, err) => {
  console.log("Error", err);
  if (err.response.data) console.log(err.response.data.errors);
  return res.status(400).json({
    status: "failed",
    msg: err.message,
  });
};

module.exports = (err, req, res, next) => {
  console.log("jkl");
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  devModeErrorResponse(req, res, err);
  //next();
};
