const response = {
  error: (res, status, errorMessage, error) => res.status(status)
    .json({
      code: status,
      message: errorMessage,
      error,
    }),
};

export default response;
