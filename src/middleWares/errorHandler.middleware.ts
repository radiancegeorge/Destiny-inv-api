import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err); // Log the error for debugging purposes

  // Check if the error has a specific HTTP status code
  const statusCode = err.status || err.statusCode || 500;

  // Set the response status code and send an error message
  delete err.status;
  delete err.statusCode;
  res.status(statusCode).json({ error: err });
};

export default errorHandler;
