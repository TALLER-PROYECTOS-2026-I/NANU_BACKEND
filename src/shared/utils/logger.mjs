export const logger = {
  info: (message, data = null) => {
    console.info(
      JSON.stringify({
        level: "INFO",
        timestamp: new Date().toISOString(),
        message,
        ...(data && { data }),
      }),
    );
  },

  error: (message, error = null) => {
    console.error(
      JSON.stringify({
        level: "ERROR",
        timestamp: new Date().toISOString(),
        message,
        ...(error && { error: error.message, stack: error.stack }),
      }),
    );
  },

  warn: (message, data = null) => {
    console.warn(
      JSON.stringify({
        level: "WARN",
        timestamp: new Date().toISOString(),
        message,
        ...(data && { data }),
      }),
    );
  },
};
