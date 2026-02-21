/**
 * Middleware: Centralized Error Handler
 * 
 * This middleware catches all errors in the application and
 * returns consistent error responses to the client.
 * 
 * Used in: server.js (at the end of middleware chain)
 */

export const errorMiddleware = (err, req, res, next) => {
  // Default error status and message
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`❌ Error [${status}]: ${message}`);

  // Send error response
  res.status(status).json({
    success: false,
    message: message,
    error: process.env.NODE_ENV === 'production' ? {} : err, // Hide error details in production
  });
};

export default errorMiddleware;
