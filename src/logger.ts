import { createLogger, format, transports } from 'winston'

interface TransformableInfo {
  level: string
  message: string
  [key: string]: string
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.colorize(),
        format.printf(({ level, message, timestamp }: TransformableInfo) => `${timestamp} - ${level}: ${message}`)
      )
    })
  ]
})

// Set stream to log requests via morgan.
logger.stream = {
  write: (message: string) => { logger.info(message.trim()) }
} as any // Incorrect type, must be NodeJS.ReadableStream

export default logger
