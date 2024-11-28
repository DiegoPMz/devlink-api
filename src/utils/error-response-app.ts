type ErrorResponseCause = Record<string, string>;

interface ErrorResponseApp {
  status: number;
  cause: ErrorResponseCause;
}

const createErrorResponseApp = (
  status: number,
  cause: ErrorResponseCause,
): ErrorResponseApp => ({
  status,
  cause: cause,
});

export default createErrorResponseApp;
