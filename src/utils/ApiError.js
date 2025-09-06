class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something Went Wrong",
    errors = {},
    stack
  ) {
    super(message);
    this.message = message;
    this.success = false;
    this.statusCode = statusCode;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor); // this will ignore other errors and led you to files and list of function calls where the exact error has occured
    }
  }
}

export { ApiError };
