// Not found middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // In production, don't expose detailed error messages
  const errorMessage = process.env.NODE_ENV === 'production' 
    ? 'Server Error' 
    : err.message;
  
  res.status(statusCode);
  res.json({
    message: errorMessage,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler }; 