export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export default function errorMiddleware(error, _req, res, _next) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({
      success: false,
      message: error.message,
    });
  }

  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "Malformed JSON request body.",
    });
  }

  if (error?.code === "23505") {
    return res.status(409).json({
      success: false,
      message: "A user with that email already exists.",
    });
  }

  console.error("Unhandled API error:", error);
  return res.status(500).json({
    success: false,
    message: "An unexpected error occurred.",
  });
}
