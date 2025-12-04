import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  // Handle specific error types
  if (err instanceof ZodError) {
    return res.status(400).json({ 
      status: "error", 
      message: "Validation error",
      details: err.issues[0].message
    });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ 
      status: "error", 
      message: "Invalid or expired token" 
    });
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({ 
      status: "error", 
      message: "Validation error",
      details: err.errors 
    });
  }

  res.status(status).json({ 
    status: "error", 
    message
  });
};

export default errorHandler