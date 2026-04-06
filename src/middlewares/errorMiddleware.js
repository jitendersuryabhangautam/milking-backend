const notFoundHandler = (_req, res) => {
  res.status(404).json({ message: "Route not found" });
};

const errorHandler = (err, _req, res, _next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  console.error(err);

  res.status(statusCode).json({
    message: err.message || "Internal server error",
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
