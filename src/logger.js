const { createLogger, format, transports } = require('winston');


const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.colorize(),
        format.printf(({ level, message, timestamp }) => `${timestamp} - ${level}: ${message}`),
      ),
    }),
  ],
});

// Set stream to log requests via morgan.
logger.stream = {
  write(message) {
    logger.info(message.trim());
  },
};


module.exports = logger;
