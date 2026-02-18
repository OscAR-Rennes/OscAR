import { createLogger, format, transports } from 'winston';

const consoleFormat = format.printf(({ timestamp, level, message, ...meta }) => {
  const metaString = Object.entries(meta)
    .map(([key, value]) => `${key}=${value}`)
    .join(' ');

  return `${timestamp} [${level.toUpperCase()}] ${message}${metaString ? ' ' + metaString : ''}`;
});


const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    consoleFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: 'logs/app.log',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        consoleFormat
      )
    })
  ]
});

export default logger;