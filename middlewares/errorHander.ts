import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  // Handle specific error types
  if (err instanceof ZodError) {
    return res.status(400).json({ 
      status: "error", 
      message: "Validation error",
      details: err.flatten() 
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