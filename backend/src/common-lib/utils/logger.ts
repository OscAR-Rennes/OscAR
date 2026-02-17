import { createLogger, format, transports } from 'winston';

const customFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}] - ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: 'logs/app.log',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat
      )
    })
  ]
});

export default logger;