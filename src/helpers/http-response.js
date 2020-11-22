export const response = {
    error: (response, status, errorMessage, error) => {
        return response.status(status)
                       .json({
                        code: status,
                        message: errorMessage,
                        error,
             });
        }
}
