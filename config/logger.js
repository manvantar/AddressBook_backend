const { createLogger, transports, format } = require("winston");

const logger = createLogger({
  transports: [
    new transports.File({   
      format: format.combine(format.timestamp(), format.simple()),
      level: "info",
      filename: "logger/info.log",
    }),
    new transports.File({
      format: format.combine(format.timestamp(), format.simple()),
      level: "error",
      filename: "logger/error.log",
    }),
  ],
});

module.exports = logger;
