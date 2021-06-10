const { createLogger, transports, format } = require('winston');

const logger = createLogger({
    transports: [
        new transports.File(
            {
                level: 'error',
                filename: 'logger/error.log',
                format: format.combine(format.timestamp(), format.simple())
            }),
        new transports.File(
            {
                level: 'info',
                filename: 'logger/info.log',
                format: format.combine(format.timestamp(), format.simple())
            }),       
    ],
})

module.exports = logger;